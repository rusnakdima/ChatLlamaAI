/* system libraries */
use mongodb::{
  bson::{doc, Document},
  Collection,
  Database
};

/* models */
use crate::models::{
  chat::Chat,
  response::Response,
  user_data::UserData
};

/* services */
use super::{
  chats::get_chats_by_userid,
  manage_token,
  mongodb::connect_db
};

pub async fn get_user_by_id(userid: String) -> (Response, Option<UserData>) {
  let database: Database = connect_db("cloud").await.unwrap();
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
            data: serde_json::to_string(&user_data).unwrap(),
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
    }
  }
}

pub async fn get_users_by_chats(typedb: String, userid: String) -> Response {
  let database: Database = connect_db("cloud").await.unwrap();
  let coll: Collection<Document> = database.collection("users");

  let result_chats = get_chats_by_userid(typedb, userid).await;

  if result_chats.status == "error" {
    return result_chats;
  }

  let mut list_profiles: Vec<UserData> = Vec::new();

  let list_chats: Vec<Chat> = serde_json::from_str(&result_chats.data).unwrap();

  for chat in list_chats {
    let user_result = coll
      .find_one(doc! { "id": chat.userId })
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

          if !list_profiles.iter().any(|profile: &UserData| profile.id == user_data.id) {
            list_profiles.push(user_data);
          }
        } else {
          return Response {
            status: "error".to_string(),
            message: "Error! User not found!".to_string(),
            data: "".to_string(),
          }
        }
      }
      Err(e) => {
        return Response {
          status: "error".to_string(),
          message: format!("Error: {}", e),
          data: "".to_string(),
        }
      },
    }
  }

  Response {
    status: "success".to_string(),
    message: "".to_string(),
    data: serde_json::to_string(&list_profiles).unwrap(),
  }
}

pub async fn update_user_image(user_form: UserData) -> Response {
  let database: Database = connect_db("cloud").await.unwrap();
  let coll: Collection<Document> = database.collection("users");

  let user_result = coll
    .find_one(doc! { "id": user_form.id.clone() })
    .await;

  match user_result {
    Ok(user) => {
      if user.is_some() {
        let _ = coll.update_one(
          doc! { "id": user_form.id.clone() },
          doc! { "$set": { "image": user_form.image.clone() } },
        );
        let token = manage_token::create(user_form.clone());

        return Response {
          status: "success".to_string(),
          message: "".to_string(),
          data: token.unwrap(),
        };
      } else {
        return Response {
          status: "error".to_string(),
          message: "User not found!".to_string(),
          data: "".to_string(),
        };
      }
    }
    Err(_) => {
      return Response {
        status: "error".to_string(),
        message: "Error!".to_string(),
        data: "".to_string(),
      };
    },
  }
}