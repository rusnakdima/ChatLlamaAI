export class User {
  constructor(
    public id: string,
    public username: string,
    public role: string,
    public image: string,
  ) {}

  public static fromJson(json: any): User {
    return new User(
      json.id,
      json.username,
      json.role,
      json.image,
    );
  }

  public toJson(): any {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      image: this.image,
    };
  }
}
