
/* sys lib */
use std::time::Duration;
use mongodb::{
  error::Error,
  options::ClientOptions,
  Client,
  Database,
  bson::doc
};

/* models */
use crate::models::{
  chat::Chat,
  message::Message,
  public_chat::PublicChat,
  response::Response
};

/* services */
use crate::services::{
  chats::get_chats_by_userid,
  chats::import_export_chats,
  messages::get_messages_by_chatid_for_ie,
  messages::import_export_message,
  public_chat::get_public_chats_by_userid_for_ie,
  public_chat::import_export_public_chat,
};

pub async fn connect_db(typedb: &str) -> Result<Database, Error> {
  let mut mongodb_uri: &str = "";
  if typedb == "cloud" {
    mongodb_uri = "mongodb+srv://Dmitriy303:dmitriy303369@cluster0.nnrtw4y.mongodb.net/ChatLlamaAI?retryWrites=true&w=majority&appName=Cluster0";
  } else if typedb == "local" {
    mongodb_uri = "mongodb://127.0.0.1:27017/ChatLlamaAI";
  }

  let mut client_options = ClientOptions::parse(mongodb_uri).await?;

  client_options.connect_timeout = Some(Duration::from_millis(4000));
  client_options.server_selection_timeout = Some(Duration::from_millis(4000));

  let client = Client::with_options(client_options).unwrap();

  let database = client.database("ChatLlamaAI");
  let check_connect = database.run_command( doc! { "ping": 1 } ).await;

  match check_connect {
    Ok(_) => {
      Ok(database)
    }
    Err(error) => {
      Err(error)
    }
  }
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

pub async fn import(userid: String) -> Response {
  let pub_chats_result = get_public_chats_by_userid_for_ie("cloud".to_string(), userid.clone()).await;
  if pub_chats_result.status == "error" {
    return pub_chats_result;
  }

  let pub_chats_vec: Vec<PublicChat> = serde_json::from_str(&pub_chats_result.data).unwrap();
  for pub_chat in pub_chats_vec {
    let result_import_pub_chat = import_export_public_chat("local".to_string(), pub_chat).await;
    if result_import_pub_chat.status == "error" {
      return result_import_pub_chat;
    }
  }

  let chats_result = get_chats_by_userid("cloud".to_string(), userid.clone()).await;
  if chats_result.status == "error" {
    return chats_result;
  }

  let chats_vec: Vec<Chat> = serde_json::from_str(&chats_result.data).unwrap();
  for chat in chats_vec {
    let result_import_chat = import_export_chats("local".to_string(), chat.clone()).await;
    if result_import_chat.status == "error" {
      return result_import_chat;
    }

    let messages_result = get_messages_by_chatid_for_ie("cloud".to_string(), chat.id.clone().to_string()).await;
    if messages_result.status == "error" {
      return messages_result;
    }

    let messages_vec: Vec<Message> = serde_json::from_str(&messages_result.data).unwrap();
    for message in messages_vec {
      let result_import_message = import_export_message("local".to_string(), message).await;
      if result_import_message.status == "error" {
        return result_import_message;
      }
    }
  }

  return Response {
    status: "success".to_string(),
    message: "Import successful!".to_string(),
    data: "".to_string(),
  }
}

pub async fn export(userid: String) -> Response {
  let pub_chats_result = get_public_chats_by_userid_for_ie("local".to_string(), userid.clone()).await;
  if pub_chats_result.status == "error" {
    return pub_chats_result;
  }

  let pub_chats_vec: Vec<PublicChat> = serde_json::from_str(&pub_chats_result.data).unwrap();
  for pub_chat in pub_chats_vec {
    let result_import_pub_chat = import_export_public_chat("cloud".to_string(), pub_chat).await;
    if result_import_pub_chat.status == "error" {
      return result_import_pub_chat;
    }
  }

  let chats_result = get_chats_by_userid("local".to_string(), userid.clone()).await;
  if chats_result.status == "error" {
    return chats_result;
  }

  let chats_vec: Vec<Chat> = serde_json::from_str(&chats_result.data).unwrap();
  for chat in chats_vec {
    let result_import_chat = import_export_chats("cloud".to_string(), chat.clone()).await;
    if result_import_chat.status == "error" {
      return result_import_chat;
    }

    let messages_result = get_messages_by_chatid_for_ie("local".to_string(), chat.id.clone().to_string()).await;
    if messages_result.status == "error" {
      return messages_result;
    }

    let messages_vec: Vec<Message> = serde_json::from_str(&messages_result.data).unwrap();
    for message in messages_vec {
      let result_import_message = import_export_message("cloud".to_string(), message).await;
      if result_import_message.status == "error" {
        return result_import_message;
      }
    }
  }

  return Response {
    status: "success".to_string(),
    message: "Export successful!".to_string(),
    data: "".to_string(),
  }
}