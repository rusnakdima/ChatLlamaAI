export class Response {
  constructor(
    public status: "success" | "warning" | "error",
    public message: string,
    public data: any
  ) {}

  public static fromJson(json: any): Response {
    return new Response(json.status, json.message, json.data);
  }
}
