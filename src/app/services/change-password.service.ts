/* system libraries */
import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

/* models */
import { Response } from '@models/response';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  constructor() {}

  async checkToken(data: { username: string, token: string }): Promise<Response> {
    const rawRes = (await invoke("check_token", data)) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }
  
  async sendRequest(data: { username: string, password: string, token: string }): Promise<Response> {
    const rawRes = (await invoke("change_password", data)) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }
}
