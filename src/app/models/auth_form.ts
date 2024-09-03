export class AuthForm {
  constructor(
    public username: string,
    public password: string,
    public remember: boolean,
  ) {}

  public static fromJson(json: any): AuthForm {
    return new AuthForm(
      json.username,
      json.password,
      json.remember,
    );
  }

  public toJson(): any {
    return {
      username: this.username,
      password: this.password,
      remember: this.remember,
    };
  }
}
