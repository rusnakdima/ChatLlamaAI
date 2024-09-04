/* system libraries */
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Message {
  pub id: String,
  pub chatId: String,
  pub content: String,
  pub userId: String,
  pub createdAt: String,
}