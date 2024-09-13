use chrono::Days;
use jsonwebtoken::{errors::Error, EncodingKey, Header, };
use serde_json::json;

use crate::models::user_data::UserData;

pub fn create(user_data: UserData) -> Result<String, Error> {
  let secret: String = "q3tb@!jnk$^hg8*u5zv9&m6x1s2w7p4r0e3".to_string();

  let c = json!({
    "data": &user_data,
    "exp": chrono::Utc::now().checked_add_days(Days::new(7)).unwrap().timestamp()
  });

  let token = jsonwebtoken::encode(&Header::default(), &c, &EncodingKey::from_secret(secret.as_ref()));

  token
}