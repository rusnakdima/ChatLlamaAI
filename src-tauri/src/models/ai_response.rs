/* sysytem libraries */
use serde::{Deserialize, Serialize};

/* models */
use super::ai_message::AIMessage;

#[derive(Debug, Serialize, Deserialize)]
pub struct AIResponse {
  pub model: String,
  pub created_at: String,
  pub message: AIMessage,
  pub done: bool,
  pub total_duration: i64,
  pub load_duration: i64,
  pub prompt_eval_count: i64,
  pub prompt_eval_duration: i64,
  pub eval_count: i64,
  pub eval_duration: i64
}