use crate::{
  models::response::Response,
  services
};

#[tauri::command]
pub async fn ask_ai(userid: String, chatid: String, message: String) -> String {
  let res: Response = services::ai::ask_ai(userid, chatid, message).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}