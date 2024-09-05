/* system libraries */
use mongodb::{
  bson::{doc, Document},
  Collection, Database,
};
use uuid::Uuid;

/* models */
use crate::models::{
  chat::Chat, message::Message, message_full::MessageFull, response::Response,
  user_data::UserData,
};

/* services */
use super::{
  chats::get_chat_by_id,
  mongodb::connect_db,
  users::get_user_by_id
};

pub async fn send_message(message_form: Message) -> Response {
  let database: Database = connect_db().await.unwrap();
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
        get_chat_by_id(message_form.chatId.clone()).await;
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

pub async fn delete_messages(chatid: String) -> Response {
  let database: Database = connect_db().await.unwrap();
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
          status: "error".to_string(),
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
