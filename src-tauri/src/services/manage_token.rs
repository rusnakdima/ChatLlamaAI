use jsonwebtoken::{errors::Error, EncodingKey, Header};

use crate::models::user_data::UserData;

pub fn create(user_data: UserData) -> Result<String, Error> {
  let secret: String = "q3tb@!jnk$^hg8*u5zv9&m6x1s2w7p4r0e3".to_string();

  let temp_data: String = serde_json::to_string(&user_data).unwrap();

  let token = jsonwebtoken::encode(&Header::default(), &temp_data, &EncodingKey::from_secret(secret.as_ref()));

  token
}