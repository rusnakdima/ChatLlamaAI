/* system libraries */
use mongodb::{
  bson::{doc, Document},
  Collection,
  Database
};
use uuid::Uuid;

/* models */
use crate::models::{
  chat::Chat,
  public_chat::PublicChat,
  public_chat_full::PublicChatFull,
  response::Response,
  user_data::UserData
};

/* services */
use super::{
  chats::get_chat_by_id,
  mongodb::connect_db,
  users::get_user_by_id
};

pub async fn get_all_public_chats(userid: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("public_chats");

  let mut public_chats_result = coll
    .find(doc! { "userId": userid })
    .await;

  match public_chats_result {
    Ok(_) => {
      let mut public_chats_vec: Vec<PublicChatFull> = Vec::new();
      while public_chats_result.as_mut().unwrap().advance().await.unwrap() {
        let pub_chat_doc: Document = Document::try_from(public_chats_result.as_ref().unwrap().current()).unwrap();
        let (_, user): (Response, Option<UserData>) = get_user_by_id(pub_chat_doc.get_str("userId").unwrap().to_string().clone()).await;
        let (_, chat): (Response, Option<Chat>) = get_chat_by_id(pub_chat_doc.get_str("chatId").unwrap().to_string().clone()).await;
        let pub_chat: PublicChatFull = PublicChatFull {
          id: pub_chat_doc.get_str("id").unwrap().to_string(),
          user: user.unwrap().clone(),
          chat: chat.unwrap().clone(),
          createdAt: pub_chat_doc.get_str("createdAt").unwrap().to_string(),
        };
        public_chats_vec.push(pub_chat);
      }

      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: serde_json::to_string(&public_chats_vec.clone()).unwrap(),
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

pub async fn add_public_chat(public_chat_form: PublicChat) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("public_chats");

  let public_chat_doc = doc! {
    "id": Uuid::new_v4().to_string(),
    "userId": public_chat_form.userId.clone(),
    "chatId": public_chat_form.chatId.clone(),
    "createdAt": public_chat_form.createdAt.clone(),
  };

  let public_chat_result = coll
    .find_one(doc! {
      "userId": public_chat_form.userId,
      "chatId": public_chat_form.chatId
    })
    .await;

  match public_chat_result {
    Ok(None) => {
      let insert_result = coll
        .insert_one(public_chat_doc.clone())
        .await;
      match insert_result {
        Ok(_) => {
          return Response {
            status: "success".to_string(),
            message: "Public chat added successfully!".to_string(),
            data: "".to_string(),
          };
        }
        Err(e) => {
          return Response {
            status: "error".to_string(),
            message: format!("Error inserting public chat: {}", e),
            data: "".to_string(),
          };
        }
      }
    }
    Ok(Some(_)) => {
      return Response {
        status: "error".to_string(),
        message: "Public chat already exists!".to_string(),
        data: "".to_string(),
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

pub async fn delete_public_chat(id: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("public_chats");

  let result = coll
    .delete_one(doc! { "id": id.clone() })
    .await;

  match result {
    Ok(deletion_result) => {
      if deletion_result.deleted_count == 1 {
        return Response {
          status: "success".to_string(),
          message: "Public chat deleted successfully!".to_string(),
          data: "".to_string(),
        };
      } else {
        return Response {
          status: "error".to_string(),
          message: "Public chat not found!".to_string(),
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

pub async fn delete_public_chat_by_chat_id(chatid: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("public_chats");

  let result = coll
    .delete_one(doc! { "chatId": chatid.clone() })
    .await;

  match result {
    Ok(deletion_result) => {
      if deletion_result.deleted_count == 1 {
        return Response {
          status: "success".to_string(),
          message: "Public chat deleted successfully!".to_string(),
          data: "".to_string(),
        };
      } else {
        return Response {
          status: "warning".to_string(),
          message: "Public chat not found!".to_string(),
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