use crate::{
  models::{
    auth_form::AuthForm,
    reg_form::RegForm,
    response::Response
  },
  services
};

#[tauri::command]
pub async fn login(username: String, password: String, remember: bool) -> String {
  let auth_form: AuthForm = AuthForm {
    username: username,
    password: password,
    remember: remember
  };
  let res: Response = services::auth::login(&auth_form).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn signup(email: String, username: String, password: String) -> String {
  let auth_form: RegForm = RegForm {
    email: email,
    username: username,
    password: password,
  };
  let res: Response = services::auth::signup(&auth_form).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn reset_password(email: String) -> String {
  let res: Response = services::auth::reset_password(email).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn check_token(username: String, token: String) -> String {
  let res: Response = services::auth::check_token(username, token).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn change_password(username: String, password: String, token: String) -> String {
  let res: Response = services::auth::change_password(username, password, token).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}