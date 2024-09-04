/* system libraries */
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Chat {
  pub id: String,
  pub title: String,
  pub userId: String,
  pub createdAt: String,
  pub isPublic: bool,
}