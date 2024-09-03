/* system libraries */
use mongodb::bson::{doc, Document};
use mongodb::{Collection, Database};
use uuid::Uuid;

/* models */
use crate::models::auth_form::AuthForm;
use crate::models::reg_form::RegForm;
use crate::models::reset_form::ResetForm;
use crate::models::response::Response;
use crate::models::user_data::UserData;

/* services */
use super::manage_token;
use super::mongodb::connect_db;

pub async fn login(auth_form: &AuthForm) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("users");

  let user_result = coll
    .find_one(doc! { "username": auth_form.username.clone() })
    .await;

  match user_result {
    Ok(user) => {
      if let Some(user_doc) = user {
        let hashed_password = user_doc.get_str("password").unwrap();
        if bcrypt::verify(auth_form.password.clone(), hashed_password).unwrap() {
          let user: UserData = UserData {
            id: user_doc.get_str("id").unwrap().to_string(),
            username: user_doc.get_str("username").unwrap().to_string(),
            role: user_doc.get_str("role").unwrap().to_string(),
            image: user_doc.get_str("image").unwrap().to_string()
          };
          let token = manage_token::create(user);

          match token {
            Ok(token) => {
              return Response {
                status: "success".to_string(),
                message: "Authentication was successful!".to_string(),
                data: token,
              };
            }
            Err(_) => {
              return Response {
                status: "error".to_string(),
                message: "The token could not be generated".to_string(),
                data: "".to_string(),
              };
            }
          }
        } else {
          return Response {
            status: "error".to_string(),
            message: "Invalid password!".to_string(),
            data: "".to_string(),
          };
        }
      } else {
        return Response {
          status: "error".to_string(),
          message: "User not found!".to_string(),
          data: "".to_string(),
        };
      }
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      };
    }
  }
}

pub async fn signup(auth_form: &RegForm) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("users");

  let user_result = coll
    .find_one(doc! { "username": auth_form.username.clone() })
    .await;

  match user_result {
    Ok(user) => {
      if let Some(_) = user {
        return Response {
          status: "error".to_string(),
          message: "Username already exists!".to_string(),
          data: "".to_string(),
        };
      } else {
        let hash_pass = bcrypt::hash(auth_form.password.clone(), 10).unwrap();
        let new_user_id = Uuid::new_v4().to_string();
        let result = coll.insert_one(doc! {
          "id": new_user_id.clone(),
          "email": auth_form.email.clone(),
          "username": auth_form.username.clone(),
          "password": hash_pass.clone(),
          "role": "user".to_string(),
          "image": "/assets/images/user.png".to_string(),
          "resetToken": "".to_string(),
        }).await;
        if let Ok(_) = result {
          return Response {
            status: "success".to_string(),
            message: "Registration successful!".to_string(),
            data: "".to_string(),
          };
        } else {
          return Response {
            status: "error".to_string(),
            message: "Error!".to_string(),
            data: "".to_string(),
          };
        }
      }
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      };
    }
  }
}

pub async fn reset_password(email: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("users");

  let user_result = coll
    .find_one(doc! { "email": email.clone() })
    .await;

  match user_result {
    Ok(user) => {
      if let Some(user_doc) = user {
        let token = Uuid::new_v4().to_string();
        let expires_at = chrono::Utc::now().checked_add_days(chrono::Days::new(1 as u64)).unwrap().timestamp();
        let reset_token = format!("{}:{}", token, format!("{:?}", expires_at));

        let new_user = doc! {
          "id": user_doc.get_str("id").unwrap().to_string(),
          "email": user_doc.get_str("email").unwrap().to_string(),
          "username": user_doc.get_str("username").unwrap().to_string(),
          "password": user_doc.get_str("password").unwrap().to_string(),
          "role": user_doc.get_str("role").unwrap().to_string(),
          "image": user_doc.get_str("image").unwrap().to_string(),
          "resetToken": reset_token.clone()
        };

        let _ = coll.update_one(
          doc! { "id": user_doc.get_str("id").unwrap().to_string() },
          doc! { "$set": new_user }
        ).await;

        let res_form: ResetForm = ResetForm {
          username: user_doc.get_str("username").unwrap().to_string(),
          token: reset_token.to_string().clone()
        };

        return Response {
          status: "success".to_string(),
          message: "The password reset request has been successfully completed!".to_string(),
          data: serde_json::to_string(&res_form).unwrap(),
        };
      } else {
        return Response {
          status: "error".to_string(),
          message: "No user found with this email!".to_string(),
          data: "".to_string(),
        };
      }
    }
    Err(e) => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: {}", e),
        data: "".to_string(),
      };
    }
  }
}

pub async fn check_token(username: String, token: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("users");

  let user_result = coll
    .find_one(doc! { "username": username.clone() })
    .await;

  match user_result {
    Ok(user) => {
      if let Some(user_doc) = user {
        let split_result: Vec<&str> = token.split(':').collect();
        if split_result[0].to_string() == "" {
          return Response {
            status: "error".to_string(),
            message: "Token is invalid!".to_string(),
            data: "".to_string(),
          };
        } else if user_doc.get_str("resetToken").unwrap().to_string() != token {
          return Response {
            status: "error".to_string(),
            message: "Token is invalid!".to_string(),
            data: "".to_string(),
          };
        } else if split_result[1].parse::<i64>().unwrap() < chrono::Local::now().timestamp() {
          return Response {
            status: "error".to_string(),
            message: "The token has expired!".to_string(),
            data: "".to_string(),
          };
        } else {
          return Response {
            status: "success".to_string(),
            message: "Token is valid!".to_string(),
            data: "".to_string(),
          };
        }
      } else {
        return Response {
          status: "error".to_string(),
          message: "No user found with this email!".to_string(),
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
    }
  }
}

pub async fn change_password(username: String, password: String, token: String) -> Response {
  let database: Database = connect_db().await.unwrap();
  let coll: Collection<Document> = database.collection("users");

  let user_result = coll
    .find_one(doc! { "username": username.clone() })
    .await;

  match user_result {
    Ok(user) => {
      if let Some(user_doc) = user {
        let split_result: Vec<&str> = token.split(":").collect();
        if user_doc.get_str("resetToken").unwrap().to_string() != "" {
          if split_result[1].parse::<i64>().unwrap() < chrono::Local::now().timestamp() {
            return Response {
              status: "error".to_string(),
              message: "The token has expired!".to_string(),
              data: "".to_string(),
            };
          } else {
            let hash_pass = bcrypt::hash(password.clone(), 10).unwrap();
            let new_user = doc! {
              "id": user_doc.get_str("id").unwrap().to_string(),
              "email": user_doc.get_str("email").unwrap().to_string(),
              "username": user_doc.get_str("username").unwrap().to_string(),
              "password": hash_pass.to_string(),
              "role": user_doc.get_str("role").unwrap().to_string(),
              "image": user_doc.get_str("image").unwrap().to_string(),
              "resetToken": "".to_string()
            };
            let _ = coll.update_one(
              doc! { "username": username.clone() },
              doc! { "$set": new_user },
            ).await;

            return Response {
              status: "success".to_string(),
              message: "Password has been successfully changed!".to_string(),
              data: "".to_string(),
            };
          }
        } else {
          return Response {
            status: "error".to_string(),
            message: "Invalid token!".to_string(),
            data: "".to_string(),
          };
        }
      } else {
        return Response {
          status: "error".to_string(),
          message: "No user found with this email!".to_string(),
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
    }
  }
}