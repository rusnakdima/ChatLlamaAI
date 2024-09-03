use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ResetForm {
  pub username: String,
  pub token: String,
}