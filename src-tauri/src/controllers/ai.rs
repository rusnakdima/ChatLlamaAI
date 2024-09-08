use crate::{
  models::response::Response,
  services
};

#[tauri::command]
pub async fn ask_ai(chatid: String, message: String) -> String {
  let res: Response = services::ai::ask_ai(chatid, message).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}