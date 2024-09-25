/* sys lib */
use std::fs::File;
use std::io::Write;

use tauri::Manager;
use tauri_plugin_http::reqwest;

/* models */
use crate::models::response::Response;

pub async fn download_file(app_handle: tauri::AppHandle, url: String, file_name: String) -> Response {
  let response = reqwest::get(url).await;

  match response {
    Ok(response) => {
      let download_folder = app_handle.path().download_dir();

      match download_folder {
        Ok(path) => {
          let file_path = path.join(&file_name);
          let mut file = File::create(&file_path);

          match file {
            Ok(mut file) => {
              let bytes = response.bytes().await.unwrap();
              let _ = file.write_all(&bytes);

              return Response {
                status: "success".to_string(),
                message: "".to_string(),
                data: format!("{}", file_path.display())
              };
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
        Err(e) => {
          return Response {
            status: "error".to_string(),
            message: format!("Error: {}", e),
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
      }
    }
  }
}

pub async fn get_binary_name_file() -> Response {
  let mut name_app = String::new();
  if cfg!(target_os = "linux") {
    name_app = "chatllamaai".to_string();
  } else if cfg!(target_os = "windows") {
    name_app = "chatllamaai.exe".to_string();
  } else if cfg!(target_os = "macos") {
    name_app = "chatllamaai.app".to_string();
  } else if cfg!(target_os = "android") {
    name_app = "chatllamaai.apk".to_string();
  } else {
    return Response {
      status: "error".to_string(),
      message: "Unknown target platform".to_string(),
      data: "".to_string()
    };
  }

  return Response {
    status: "success".to_string(),
    message: "".to_string(),
    data: name_app
  };
}