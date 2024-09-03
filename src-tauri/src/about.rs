use std::fs::File;
use std::io::Write;

use tauri::Manager;
use tauri_plugin_http::reqwest;

async fn download_file(app_handle: tauri::AppHandle, url: String, file_name: String) -> core::result::Result<String, Box<dyn std::error::Error>> {
  let response = reqwest::get(url).await?;
  let download_folder = app_handle.path().download_dir().expect("Failed to get download folder");
  let file_path = download_folder.join(&file_name);
  let mut file = File::create(&file_path).expect("Failed to create file");

  let bytes = response.bytes().await?;
  let _ = file.write_all(&bytes);

  Ok(format!("{}", file_path.display()))
}

#[tauri::command]
pub async fn download_update(app_handle: tauri::AppHandle, url: String, file_name: String) -> String {
  match download_file(app_handle, url, file_name).await {
    Ok(path) => {
      format!("{}", path)
    }
    Err(error) => {
      eprintln!("Failed to download file! Error: {}", error);
      format!("Failed to download file! Error: {}", error)
    }
  }
}

#[tauri::command]
pub async fn get_binary_name_file() -> String {
  if cfg!(target_os = "linux") {
    format!("chatllamaai")
  } else if cfg!(target_os = "windows") {
    format!("chatllamaai.exe")
  } else if cfg!(target_os = "macos") {
    format!("chatllamaai.app")
  } else if cfg!(target_os = "android") {
    format!("chatllamaai.apk")
  } else {
    format!("Unknown")
  }
}