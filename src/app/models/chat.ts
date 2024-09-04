export class Chat {
  constructor(
    public id: string,
    public title: string,
    public userId: string,
    public createdAt: string,
    public isPublic: boolean,
  ) {}
}