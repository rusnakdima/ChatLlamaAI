use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AIMessage {
  pub role: String,
  pub content: String,
}