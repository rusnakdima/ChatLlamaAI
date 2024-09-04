export class Message {
  constructor(
    public id: string,
    public chatId: string,
    public content: string,
    public userId: string,
    public createdAt: string,
  ) {}

  public static fromJson(json: any): Message {
    return new Message(
      json.id,
      json.chatId,
      json.content,
      json.userId,
      json.createdAt,
    );
  }
}