/* system libraries */
use mongodb::{
  bson::{doc, Document},
  Collection, Database,
};
use uuid::Uuid;

/* models */
use crate::models::{
  chat::Chat,
  message::Message,
  message_full::MessageFull,
  user_data::UserData,
  response::Response,
};

/* services */
use super::{
  chats::{
    get_chat_by_id,
    update_date
  },
  mongodb::connect_db,
  users::get_user_by_id
};

pub async fn get_messages_by_chatid(typedb: String, chat_id: String) -> Response {
  let database: Database = connect_db(&typedb).await.unwrap();
  let coll: Collection<Document> = database.collection("messages");

  let mut messages_result = coll
    .find(doc! { "chatId": chat_id.clone() })
    .await;

  match messages_result {
    Ok(_) => {
      let mut messages_vec: Vec<MessageFull> = Vec::new();
      while messages_result.as_mut().unwrap().advance().await.unwrap() {
        let message_doc: Document = Document::try_from(messages_result.as_ref().unwrap().current()).unwrap();
        let (_, chat): (Response, Option<Chat>) = get_chat_by_id(typedb.clone(), message_doc.get_str("chatId").unwrap().to_string()).await;
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

pub async fn send_message(typedb: String, message_form: Message) -> Response {
  let database: Database = connect_db(&typedb).await.unwrap();
  let coll: Collection<Document> = database.collection("messages");

  let message_doc = doc! {
    "id": Uuid::new_v4().to_string(),
    "chatId": message_form.chatId.clone(),
    "content": message_form.content.clone(),
    "userId": message_form.userId.clone(),
    "createdAt": message_form.createdAt.clone(),
  };

  let message_result = coll
    .insert_one(message_doc.clone())
    .await;

  let result_update_chat = update_date(typedb.clone(), message_form.chatId.clone(), message_form.createdAt.clone())
    .await;

  if result_update_chat.status == "error" {
    return result_update_chat;
  }

  match message_result {
    Ok(_) => {
      let (_, user_result): (Response, Option<UserData>) =
        get_user_by_id(message_form.userId.clone()).await;
      let mut user: UserData;

      if let Some(user_data) = user_result {
        user = user_data;
      } else {
        return Response {
          status: "error".to_string(),
          message: "User not found!".to_string(),
          data: "".to_string(),
        };
      }

      let (_, chat_result): (Response, Option<Chat>) =
        get_chat_by_id(typedb.clone(), message_form.chatId.clone()).await;
      let mut chat: Chat;

      if let Some(chat_data) = chat_result {
        chat = chat_data;
      } else {
        return Response {
          status: "error".to_string(),
          message: "Chat not found!".to_string(),
          data: "".to_string(),
        };
      }

      let message_full: MessageFull = MessageFull {
        id: message_doc.get_str("id").unwrap().to_string().clone(),
        chat: chat.clone(),
        content: message_form.content.clone(),
        user: user.clone(),
        createdAt: message_form.createdAt.clone(),
      };

      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: serde_json::to_string(&message_full.clone()).unwrap(),
      };
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

pub async fn delete_messages(typedb: String, chatid: String) -> Response {
  let database: Database = connect_db(&typedb).await.unwrap();
  let coll: Collection<Document> = database.collection("messages");

  let result = coll
    .delete_many(doc! { "chatId": chatid.clone() })
    .await;

  match result {
    Ok(count) => {
      if count.deleted_count > 0 {
        return Response {
          status: "success".to_string(),
          message: "Messages deleted successfully!".to_string(),
          data: "".to_string(),
        };
      } else {
        return Response {
          status: "warning".to_string(),
          message: "No messages found to delete!".to_string(),
          data: "".to_string(),
        };
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
