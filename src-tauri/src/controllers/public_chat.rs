/* models */
use crate::models::{
  public_chat::PublicChat,
  response::Response
};

/* services */
use crate::services;

#[tauri::command]
pub async fn get_public_chats_by_userid(typedb: String, userid: String) -> String {
  let res: Response = services::public_chat::get_public_chats_by_userid(typedb, userid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn add_public_chat(typedb: String, public_chat_form_raw: String) -> String {
  let public_chat_form: PublicChat = serde_json::from_str(&public_chat_form_raw).unwrap();
  let res: Response = services::public_chat::add_public_chat(typedb, public_chat_form).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn delete_public_chat(typedb: String, id: String) -> String {
  let res: Response = services::public_chat::delete_public_chat(typedb, id).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}