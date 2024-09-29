/* system libraries */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";
import { PublicChat } from "@models/public_chat";

@Injectable({
  providedIn: "root",
})
export class SharedLinksService {
  constructor() {}

  async getPublicChatsByUserId(userId: string): Promise<Response> {
    const rawRes = (await invoke("get_public_chats_by_userid", {
      typedb: localStorage.getItem("typeDB") ?? "cloud",
      userid: userId,
    })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }

  async addPublicChat(publicChat: PublicChat): Promise<Response> {
    const rawRes = (await invoke("add_public_chat", {
      typedb: localStorage.getItem("typeDB") ?? "cloud",
      publicChatFormRaw: JSON.stringify(publicChat),
    })) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }

  async deletePublicChat(id: string): Promise<Response> {
    const rawRes = (await invoke("delete_public_chat", {
      typedb: localStorage.getItem("typeDB") ?? "cloud",
      id: id,
    })) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }
}
