mod models;
mod services;
mod controllers;

use controllers::about::{
    download_update,
    get_binary_name_file
};

use controllers::mongodb::{
    check_local_db
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
    get_chat_by_id,
    create_chat,
    rename_title_chat,
    share_chat,
    close_chat,
    delete_chat
};

use controllers::messages::{
    get_messages_by_chatid,
    send_message
};

use controllers::public_chat::{
    get_all_public_chats,
    add_public_chat,
    delete_public_chat
};

use controllers::ai::ask_ai;

use controllers::users::{
    get_user_by_id,
    get_users_by_chats,
    update_user_image
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            check_local_db,

            login,
            signup,
            reset_password,
            check_token,
            change_password,

            download_update,
            get_binary_name_file,

            get_chats_by_userid,
            get_chat_by_id,
            create_chat,
            rename_title_chat,
            share_chat,
            close_chat,
            delete_chat,

            get_messages_by_chatid,
            send_message,

            get_all_public_chats,
            add_public_chat,
            delete_public_chat,

            ask_ai,

            get_user_by_id,
            get_users_by_chats,
            update_user_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
