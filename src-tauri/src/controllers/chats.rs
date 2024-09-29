use crate::{
  models::{
    chat::Chat,
    response::Response
  },
  services
};

#[tauri::command]
pub async fn get_chats_by_userid(typedb: String, userid: String) -> String {
  let res: Response = services::chats::get_chats_by_userid(typedb, userid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn get_chat_by_id(typedb: String, chatid: String) -> String {
  let (res, _): (Response, Option<Chat>) = services::chats::get_chat_by_id(typedb, chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn create_chat(typedb: String, chat_form_raw: String) -> String {
  let chat_form: Chat = serde_json::from_str(&chat_form_raw).unwrap();
  let res: Response = services::chats::create_chat(typedb, chat_form).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn rename_title_chat(typedb: String, chat_form_raw: String) -> String {
  let chat_form: Chat = serde_json::from_str(&chat_form_raw).unwrap();
  let res: Response = services::chats::rename_title_chat(typedb, chat_form).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn share_chat(typedb: String, chatid: String) -> String {
  let res: Response = services::chats::share_chat(typedb, chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn close_chat(typedb: String, chatid: String) -> String {
  let res: Response = services::chats::close_chat(typedb, chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn delete_chat(typedb: String, chatid: String) -> String {
  let res: Response = services::chats::delete_chat(typedb, chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}