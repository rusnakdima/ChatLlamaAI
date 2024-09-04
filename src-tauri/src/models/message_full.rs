/* system libraries */
use serde::{Deserialize, Serialize};

use super::{chat::Chat, user_data::UserData};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MessageFull {
  pub id: String,
  pub chat: Chat,
  pub content: String,
  pub user: UserData,
  pub createdAt: String,
}