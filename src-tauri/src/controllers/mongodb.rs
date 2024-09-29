use crate::{
  models::response::Response,
  services
};

#[tauri::command]
pub async fn check_local_db() -> String {
  let res: Response = services::mongodb::check_local_db().await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn import(userid: String) -> String {
  let res: Response = services::mongodb::import(userid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn export(userid: String) -> String {
  let res: Response = services::mongodb::export(userid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}