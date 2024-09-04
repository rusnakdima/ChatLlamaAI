export class Chat {
  constructor(
    public id: string,
    public title: string,
    public userId: string,
    public createdAt: string,
    public isPublic: boolean,
  ) {}

  public static fromJson(json: any): Chat {
    return new Chat(
      json.id,
      json.title,
      json.userId,
      json.createdAt,
      json.isPublic,
    );
  }
}