use serde::{Deserialize, Serialize};

use super::ai_history::AIHistory;

#[derive(Debug, Serialize, Deserialize)]
pub struct AIRequest {
  pub model: String,
  pub messages: Vec<AIHistory>,
  pub stream: bool
}