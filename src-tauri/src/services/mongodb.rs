use mongodb::{error::Error, Client, Database};

use crate::models::response::Response;

pub async fn connect_db(typedb: &str) -> Result<Database, Error> {
  let mut mongodb_uri: &str = "";
  if typedb == "cloud" {
    mongodb_uri = "mongodb+srv://Dmitriy303:dmitriy303369@cluster0.nnrtw4y.mongodb.net/ChatLlamaAI?retryWrites=true&w=majority&appName=Cluster0";
  } else if typedb == "local" {
    mongodb_uri = "mongodb://127.0.0.1:27017/ChatLlamaAI";
  }

  println!("typedb: {}; mongodbutl: {}", typedb.clone(), mongodb_uri.clone());

  let client = Client::with_uri_str(mongodb_uri).await?;

  let database = client.database("ChatLlamaAI");

  Ok(database)
}

pub async fn check_local_db() -> Response {
  match connect_db("local").await {
    Ok(_) => {
      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: "".to_string(),
      };
    }
    Err(_) => {
      return Response {
        status: "error".to_string(),
        message: "".to_string(),
        data: "".to_string(),
      };
    }
  }
}