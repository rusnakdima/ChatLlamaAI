export class Message {
  constructor(
    public id: string,
    public chatId: string,
    public content: string,
    public userId: string,
    public createdAt: string,
  ) {}
}