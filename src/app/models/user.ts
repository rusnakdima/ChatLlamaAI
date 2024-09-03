export class User {
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public role: string,
    public image: string,
  ) {}

  public static fromJson(json: any): User {
    return new User(
      json.id,
      json.username,
      json.password,
      json.role,
      json.image,
    );
  }

  public toJson(): any {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      role: this.role,
      image: this.image,
    };
  }
}
