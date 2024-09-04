/* system libraries */
use mongodb::{bson::{doc, Document}, Collection, Database};

/* models */
use crate::models::{
  response::Response,
  user_data::UserData
};

/* services */
use super::mongodb::connect_db;

pub async fn get_user_by_id(userid: String) -> (Response, Option<UserData>) {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("users");

  let user_result = coll
    .find_one(doc! { "id": userid.clone() })
    .await;

  match user_result {
    Ok(user) => {
      if let Some(user_doc) = user {
        let user_data: UserData = UserData {
          id: user_doc.get_str("id").unwrap().to_string(),
          username: user_doc.get_str("username").unwrap().to_string(),
          role: user_doc.get_str("role").unwrap().to_string(),
          image: user_doc.get_str("image").unwrap().to_string(),
        };
        return (
          Response {
            status: "success".to_string(),
            message: "".to_string(),
            data: user_doc.get_str("id").unwrap().to_string().clone(),
          },
          Some(user_data)
        )
      } else {
        return (
          Response {
            status: "error".to_string(),
            message: "User not found!".to_string(),
            data: "".to_string(),
          },
          None
        )
      }
    }
    Err(_) => {
      return (
        Response {
          status: "error".to_string(),
          message: "Error!".to_string(),
          data: "".to_string(),
        },
        None
      )
    },
  }
}