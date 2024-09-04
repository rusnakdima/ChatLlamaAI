/* system libraries */
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicChat {
  pub id: String,
  pub userId: String,
  pub chatId: String,
  pub createdAt: String,
}