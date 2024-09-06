/* models */
use crate::models::{
  message::Message,
  response::Response
};

/* services */
use crate::services;

#[tauri::command]
pub async fn get_messages_by_chatid(chatid: String) -> String {
  let res: Response = services::messages::get_messages_by_chatid(chatid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn send_message(message_form_raw: String) -> String {
  let message_form: Message = serde_json::from_str(&message_form_raw).unwrap();
  let res: Response = services::messages::send_message(message_form).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}