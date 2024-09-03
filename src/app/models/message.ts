export class Message {
  constructor(
    public id: string,
    public content: string,
    public sender: string,
    public timestamp: Date,
  ) {}
}