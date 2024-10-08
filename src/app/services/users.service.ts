/* system libraries */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor() {}

  async getUserById(userId: string): Promise<Response> {
    const rawRes = (await invoke("get_user_by_id", {
      userid: userId,
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }

  async getUsersByChats(userId: string): Promise<Response> {
    const rawRes = (await invoke("get_users_by_chats", {
      userid: userId,
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }

  async updateUserImage(userForm: any): Promise<Response> {
    const rawRes = (await invoke("update_user_image", {
      userFormRaw: JSON.stringify(userForm),
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }
}
