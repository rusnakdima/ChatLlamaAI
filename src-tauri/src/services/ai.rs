/* system libraries */
use http::StatusCode;
use tauri_plugin_http::reqwest;
use uuid::Uuid;

/* models */
use crate::models::{
  ai_history::AIHistory,
  ai_request::AIRequest,
  ai_response::AIResponse,
  chat::Chat,
  message::Message,
  message_full::MessageFull,
  response::Response,
  user_data::UserData
};

/* services */
use super::chats::get_chat_by_id;
use super::messages::{
  get_messages_by_chatid,
  send_message
};
use super::users::get_user_by_id;

pub async fn ask_ai(typedb: String, chatid: String, message: String) -> Response {
  let (_, user_result): (Response, Option<UserData>) = get_user_by_id("80c9c4a6-9046-44e7-ba54-73d285ed8c78".to_string()).await;
  let mut user: UserData;

  if let Some(user_data) = user_result {
    user = user_data;
  } else {
    return Response {
      status: "error".to_string(),
      message: "User not found!".to_string(),
      data: "".to_string(),
    }
  }

  let (_, chat_result): (Response, Option<Chat>) = get_chat_by_id(typedb.clone(), chatid.clone()).await;
  let mut chat: Chat;

  if let Some(chat_data) = chat_result {
    chat = chat_data;
  } else {
    return Response {
      status: "error".to_string(),
      message: "Chat not found!".to_string(),
      data: "".to_string(),
    }
  }

  let messages_res: Response = get_messages_by_chatid(typedb.clone(), chatid.clone()).await;

  let mut messages: Vec<MessageFull> = serde_json::from_str(&messages_res.data.as_str()).unwrap();

  let mut messages_history: Vec<AIHistory> = Vec::new();

  for message_iter in messages.iter() {
    messages_history.push(AIHistory {
      role: if message_iter.user.id.clone() == user.id.clone() { "assistant".to_string() } else { "user".to_string() },
      content: message_iter.content.clone(),
    });
  }

  messages_history.push(AIHistory {
    role: "user".to_string(),
    content: message.clone()
  });

  let json_data: AIRequest = AIRequest {
    model: "llama3.1:8b".to_string(),
    messages: messages_history,
    stream: false
  };

  let client = reqwest::Client::new();
  let ai_response = client
    .post("http://localhost:11434/api/chat")
    .header("Content-Type", "application/json")
    .body(serde_json::to_string(&json_data).unwrap().to_owned())
    .send()
    .await
    .unwrap();

  let ai_res: AIResponse = match ai_response.status() {
    StatusCode::OK => serde_json::from_str(&ai_response.text().await.unwrap().as_str()).unwrap(),
    _ => {
      return Response {
        status: "error".to_string(),
        message: "Error!".to_string(),
        data: "".to_string(),
      }
    }
  };

  let ai_text = ai_res.message.content.to_string();

  let message_form: Message = Message {
    id: Uuid::new_v4().to_string(),
    chatId: chatid.clone(),
    content: ai_text.clone(),
    userId: user.id.clone(),
    createdAt: format!("{}", chrono::Utc::now().format("%Y-%m-%dT%H:%M:%S%.3fZ")),
  };

  let save_message: Response = send_message(typedb.clone(), message_form.clone()).await;

  if save_message.status == "error" {
    return save_message;
  }

  let message_full: MessageFull = MessageFull {
    id: message_form.id.clone(),
    chat: chat.clone(),
    content: ai_text.clone(),
    user: user.clone(),
    createdAt: message_form.createdAt.clone()
  };

  return Response {
    status: "success".to_string(),
    message: "".to_string(),
    data: serde_json::to_string(&message_full.clone()).unwrap(),
  }
}