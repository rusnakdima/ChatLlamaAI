use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AIHistory {
  pub role: String,
  pub content: String,
}