mod models;
mod services;
mod controllers;

mod about;

use about::{
    download_update,
    get_binary_name_file
};

use controllers::auth::{
    login,
    signup,
    reset_password,
    check_token,
    change_password
};

use controllers::chats::{
    get_chats_by_userid,
    get_chat_messages,
    create_chat,
    send_message,
    share_chat,
    close_chat,
    delete_chat
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            login,
            signup,
            reset_password,
            check_token,
            change_password,

            download_update,
            get_binary_name_file,

            get_chats_by_userid,
            get_chat_messages,
            create_chat,
            send_message,
            share_chat,
            close_chat,
            delete_chat,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
