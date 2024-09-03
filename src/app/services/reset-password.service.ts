/* system libraries */
import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

/* models */
import { Response } from '@models/response';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  constructor() {}

  async sendRequest(email: string): Promise<Response> {
    const rawRes = (await invoke("reset_password", { email: email })) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }
}
