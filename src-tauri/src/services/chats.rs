/* system libraries */
use mongodb::{
  bson::{doc, Document},
  Collection, Database,
};
use uuid::Uuid;

/* models */
use crate::models::{
  chat::Chat,
  message_full::MessageFull,
  response::Response,
  user_data::UserData
};

/* services */
use super::{
  messages::delete_messages,
  mongodb::connect_db,
  users::get_user_by_id
};

pub async fn get_chats_by_userid(userid: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("chats");

  let mut chats_result = coll
    .find(doc! { "userId": userid.clone() })
    .await;

  match chats_result {
    Ok(_) => {
      let mut chats_vec: Vec<Chat> = Vec::new();
      while chats_result.as_mut().unwrap().advance().await.unwrap() {
        let chat_doc: Document = Document::try_from(chats_result.as_ref().unwrap().current()).unwrap();
        let chat: Chat = Chat {
          id: chat_doc.get_str("id").unwrap().to_string(),
          title: chat_doc.get_str("title").unwrap().to_string(),
          userId: chat_doc.get_str("userId").unwrap().to_string(),
          createdAt: chat_doc.get_str("createdAt").unwrap().to_string(),
          updatedAt: chat_doc.get_str("updatedAt").unwrap().to_string(),
          isPublic: chat_doc.get_bool("isPublic").unwrap(),
        };
        chats_vec.push(chat);
      }

      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: serde_json::to_string(&chats_vec.clone()).unwrap(),
      };
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      };
    }
  }
}

pub async fn get_chat_messages(chat_id: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("messages");

  let mut messages_result = coll
    .find(doc! { "chatId": chat_id.clone() })
    .await;

  match messages_result {
    Ok(_) => {
      let mut messages_vec: Vec<MessageFull> = Vec::new();
      while messages_result.as_mut().unwrap().advance().await.unwrap() {
        let message_doc: Document = Document::try_from(messages_result.as_ref().unwrap().current()).unwrap();
        let (_, chat): (Response, Option<Chat>) = get_chat_by_id(message_doc.get_str("chatId").unwrap().to_string()).await;
        let (_, user): (Response, Option<UserData>) = get_user_by_id(message_doc.get_str("userId").unwrap().to_string()).await;
        let message: MessageFull = MessageFull {
          id: message_doc.get_str("id").unwrap().to_string(),
          chat: chat.unwrap(),
          user: user.unwrap(),
          content: message_doc.get_str("content").unwrap().to_string(),
          createdAt: message_doc.get_str("createdAt").unwrap().to_string(),
        };
        messages_vec.push(message);
      }

      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: serde_json::to_string(&messages_vec.clone()).unwrap(),
      };
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      };
    }
  }
}

pub async fn get_chat_by_id(chat_id: String) -> (Response, Option<Chat>) {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("chats");

  let chat_result = coll
    .find_one(doc! { "id": chat_id.clone() })
    .await;

  match chat_result {
    Ok(chat_raw) => {
      if let Some(chat_doc) = chat_raw {
        let chat: Chat = Chat {
          id: chat_doc.get_str("id").unwrap().to_string(),
          title: chat_doc.get_str("title").unwrap().to_string(),
          userId: chat_doc.get_str("userId").unwrap().to_string(),
          createdAt: chat_doc.get_str("createdAt").unwrap().to_string(),
          updatedAt: chat_doc.get_str("updatedAt").unwrap().to_string(),
          isPublic: chat_doc.get_bool("isPublic").unwrap(),
        };

        return (
          Response {
            status: "success".to_string(),
            message: "".to_string(),
            data: serde_json::to_string(&chat).unwrap(),
          },
          Some(chat)
        );
      } else {
        return (
          Response {
            status: "error".to_string(),
            message: "The chat was not found!".to_string(),
            data: "".to_string(),
          },
          None
        );
      }
    }
    Err(e) => {
      return (
        Response {
          status: "error".to_string(),
          message: format!("Error: {}", e),
          data: "".to_string(),
        },
        None
      );
    }
  }
}

pub async fn create_chat(chat_form: Chat) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("chats");

  let chat_doc = doc! {
    "id": Uuid::new_v4().to_string(),
    "title": chat_form.title.clone(),
    "userId": chat_form.userId.clone(),
    "createdAt": chat_form.createdAt.clone(),
    "isPublic": chat_form.isPublic.clone(),
  };

  let result = coll
    .insert_one(chat_doc.clone())
    .await;

  match result {
    Ok(_) => {
      return Response {
        status: "success".to_string(),
        message: "Chat created successfully!".to_string(),
        data: chat_doc.get_str("id").unwrap().to_string().clone(),
      }
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      }
    }
  }
}

pub async fn update_date(chat_id: String, updated_at: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("chats");

  let chat_result = coll
    .find_one(doc! { "id": chat_id.clone() })
    .await;

  match chat_result {
    Ok(chat) => {
      if let Some(_) = chat {
        let result = coll
          .update_one(
            doc! { "id": chat_id.clone() },
            doc! { "$set": { "updatedAt": updated_at } },
          )
          .await;

        match result {
          Ok(_) => {
            return Response {
              status: "success".to_string(),
              message: "".to_string(),
              data: "".to_string(),
            }
          }
          Err(e) => {
            return Response {
              status: "error".to_string(),
              message: format!("Error: {}", e),
              data: "".to_string(),
            }
          }
        }
      } else {
        return Response {
          status: "error".to_string(),
          message: "The chat was not found!".to_string(),
          data: "".to_string(),
        }
      }
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      }
    }
  }
}

pub async fn share_chat(chat_id: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("chats");

  let chat_result = coll
    .find_one(doc! { "id": chat_id.clone() })
    .await;

  match chat_result {
    Ok(chat) => {
      if let Some(_) = chat {
        let _ = coll.update_one(
          doc! { "id": chat_id.clone() },
          doc! { "$set": { "isPublic": true } },
        ).await;

        return Response {
          status: "success".to_string(),
          message: "The chat has been successfully opened for public access!".to_string(),
          data: "".to_string(),
        };
      } else {
        return Response {
          status: "success".to_string(),
          message: "The chat was not found!".to_string(),
          data: "".to_string(),
        };
      }
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      };
    }
  }
}

pub async fn close_chat(chat_id: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("chats");

  let chat_result = coll
    .find_one(doc! { "id": chat_id.clone() })
    .await;

  match chat_result {
    Ok(chat) => {
      if let Some(_) = chat {
        let _ = coll.update_one(
          doc! { "id": chat_id.clone() },
          doc! { "$set": { "isPublic": false } },
        ).await;

        return Response {
          status: "success".to_string(),
          message: "The chat has been successfully closed from public access!".to_string(),
          data: "".to_string(),
        };
      } else {
        return Response {
          status: "success".to_string(),
          message: "The chat was not found!".to_string(),
          data: "".to_string(),
        };
      }
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      };
    }
  }
}

pub async fn delete_chat(chat_id: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("chats");

  let result = coll
    .delete_one(doc! { "id": chat_id.clone() })
    .await;

  let resul_del_messages = delete_messages(chat_id.clone()).await;

  if resul_del_messages.status == "error" {
    return resul_del_messages;
  }

  match result {
    Ok(deletion_result) => {
      if deletion_result.deleted_count == 1 {
        return Response {
          status: "success".to_string(),
          message: "Chat deleted successfully!".to_string(),
          data: "".to_string(),
        };
      } else {
        return Response {
          status: "success".to_string(),
          message: "The chat was not found!".to_string(),
          data: "".to_string(),
        };
      }
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      };
    }
  }
}