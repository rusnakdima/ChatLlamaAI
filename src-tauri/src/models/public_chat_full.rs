/* system libraries */
use serde::{Deserialize, Serialize};

/* models */
use super::{chat::Chat, user_data::UserData};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicChatFull {
  pub id: String,
  pub user: UserData,
  pub chat: Chat,
  pub createdAt: String,
}