use mongodb::{error::Error, Client, Database};

pub async fn connect_db() -> Result<Database, Error> {
  let mongodb_uri: &str = "mongodb://192.168.1.7:27017/ChatLlamaAI";
  // let mongodb_uri: &str = "mongodb+srv://Dmitriy303:dmitriy303369@cluster0.nnrtw4y.mongodb.net/ChatLlamaAI?retryWrites=true&w=majority&appName=Cluster0";

  let client = Client::with_uri_str(mongodb_uri).await?;

  let database = client.database("ChatLlamaAI");

  Ok(database)
}