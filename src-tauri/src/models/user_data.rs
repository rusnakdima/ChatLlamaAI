use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UserData {
  pub id: String,
  pub username: String,
  pub role: String,
  pub image: String,
}