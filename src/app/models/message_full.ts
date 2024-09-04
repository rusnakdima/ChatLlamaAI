/* models */
import { Chat } from "./chat";
import { User } from "./user";

export class MessageFull {
  constructor(
    public id: string,
    public chat: Chat,
    public content: string,
    public user: User,
    public createdAt: string,
  ) {}

  public static fromJson(json: any): MessageFull {
    const chat = Chat.fromJson(json.chat);
    const user = User.fromJson(json.user);
    return new MessageFull(
      json.id,
      chat,
      json.content,
      user,
      json.createdAt,
    );
  }
}