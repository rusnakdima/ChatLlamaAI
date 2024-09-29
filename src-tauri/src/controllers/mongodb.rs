use crate::{
  models::response::Response,
  services
};

#[tauri::command]
pub async fn check_local_db() -> String {
  let res: Response = services::mongodb::check_local_db().await;
  format!("{}", serde_json::to_string(&res).unwrap())
}