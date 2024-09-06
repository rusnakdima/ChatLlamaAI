/* models */
import { Chat } from "./chat";
import { User } from "./user";

export class PublicChatFull {
  constructor(
    public id: string,
    public user: User,
    public chat: Chat,
    public createdAt: string,
  ) {}

  public static fromJson(json: any): PublicChatFull {
    return new PublicChatFull(
      json.id,
      json.userId,
      json.chatId,
      json.createdAt,
    );
  }
}