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
  pub total_duration: i32,
  pub load_duration: i32,
  pub prompt_eval_count: i32,
  pub prompt_eval_duration: i32,
  pub eval_count: i32,
  pub eval_duration: i32
}