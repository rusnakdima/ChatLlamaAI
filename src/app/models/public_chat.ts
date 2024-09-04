export class PublicChat {
  constructor(
    public id: string,
    public userId: string,
    public chatId: string,
    public createdAt: string,
  ) {}

  public static fromJson(json: any): PublicChat {
    return new PublicChat(
      json.id,
      json.userId,
      json.chatId,
      json.createdAt,
    );
  }
}