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
pub async fn get_users_by_chats(typedb: String, userid: String) -> String {
  let res: Response = services::users::get_users_by_chats(typedb, userid).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn update_user_image(user_form_raw: String) -> String {
  let user_form: UserData = serde_json::from_str(&user_form_raw).unwrap();
  let res: Response = services::users::update_user_image(user_form).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}