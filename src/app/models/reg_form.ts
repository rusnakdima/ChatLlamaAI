export class RegForm {
  constructor(
    public email: string,
    public username: string,
    public password: string,
  ) {}

  public static fromJson(json: any): RegForm {
    return new RegForm(
      json.email,
      json.username,
      json.password
    );
  }

  public toJson(): any {
    return {
      email: this.email,
      username: this.username,
      password:  this.password,
    };
  }
}
