/* system libraries */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";

@Injectable({
  providedIn: "root",
})
export class ChatsService {
  constructor() {}

  async getChatById(chatId: string): Promise<Response> {
    const rawRes = (await invoke("get_chat_by_id", {
      chatid: chatId,
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }

  async getChatsByUserId(userId: string): Promise<Response> {
    const rawRes = (await invoke("get_chats_by_userid", {
      userid: userId,
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }

  async createChat(chatForm: any): Promise<Response> {
    const rawRes = (await invoke("create_chat", {
      chatFormRaw: JSON.stringify(chatForm),
    })) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }

  async shareChat(chatid: string): Promise<Response> {
    const rawRes = (await invoke("share_chat", { chatid: chatid })) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }

  async closeChat(chatid: string): Promise<Response> {
    const rawRes = (await invoke("close_chat", { chatid: chatid })) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }

  async deleteChat(chatid: string): Promise<Response> {
    const rawRes = (await invoke("delete_chat", { chatid: chatid })) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }
}
