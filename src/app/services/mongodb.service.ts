/* system libraries */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";

@Injectable({
  providedIn: 'root'
})
export class MongodbService {
  constructor() {}

  async checkLocalDB(): Promise<Response> {
    const rawRes = (await invoke("check_local_db")) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }
}
