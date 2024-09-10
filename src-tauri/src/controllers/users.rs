/* services */
use crate::{
  models::{
    response::Response,
    user_data::UserData
  },
  services
};

#[tauri::command]
pub async fn get_user_by_id(userid: String) -> String {
  let (res, _): (Response, Option<UserData>) = services::users::get_user_by_id(userid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn get_users_by_chats(userid: String) -> String {
  let res: Response = services::users::get_users_by_chats(userid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}