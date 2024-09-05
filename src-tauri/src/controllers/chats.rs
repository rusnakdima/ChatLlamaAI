use crate::{
  models::{
    chat::Chat,
    message::Message,
    response::Response
  },
  services
};

#[tauri::command]
pub async fn get_chats_by_userid(userid: String) -> String {
  let res: Response = services::chats::get_chats_by_userid(userid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn get_chat_messages(chatid: String) -> String {
  let res: Response = services::chats::get_chat_messages(chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn get_chat_by_id(chatid: String) -> String {
  let (res, _): (Response, Option<Chat>) = services::chats::get_chat_by_id(chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn create_chat(chat_form_raw: String) -> String {
  let chat_form: Chat = serde_json::from_str(&chat_form_raw).unwrap();
  let res: Response = services::chats::create_chat(chat_form).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn share_chat(chatid: String) -> String {
  let res: Response = services::chats::share_chat(chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn close_chat(chatid: String) -> String {
  let res: Response = services::chats::close_chat(chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn delete_chat(chatid: String) -> String {
  let res: Response = services::chats::delete_chat(chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}