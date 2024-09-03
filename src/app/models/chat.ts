import { Message } from "./message";

export class Chat {
  constructor(
    public id: string,
    public title: string,
    public userId: string,
    public createdAt: Date,
    public isPublic: boolean,
    public messages: Array<Message> = [],
  ) {}
}