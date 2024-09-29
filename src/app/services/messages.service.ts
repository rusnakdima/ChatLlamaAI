/* system libraries */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";
import { Message } from "@models/message";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  constructor() {}

  async getMessagesByChatId(chatId: string): Promise<Response> {
    const rawRes = (await invoke("get_messages_by_chatid", {
      typedb: localStorage.getItem("typeDB") ?? "cloud",
      chatid: chatId,
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }

  async sendMessage(messageForm: Message): Promise<Response> {
    const rawRes = (await invoke("send_message", {
      typedb: localStorage.getItem("typeDB") ?? "cloud",
      messageFormRaw: JSON.stringify(messageForm),
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }

  async askAI(chatId: string, message: string): Promise<Response> {
    const rawRes = (await invoke("ask_ai", {
      typedb: localStorage.getItem("typeDB") ?? "cloud",
      chatid: chatId,
      message: message,
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }
}
