/* system libraries */
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";
import { AuthForm } from "@models/auth_form";
import { RegForm } from "@models/reg_form";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor() {}

  async login(authData: AuthForm): Promise<Response> {
    const rawRes = (await invoke("login", authData.toJson())) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }

  async signup(authData: RegForm): Promise<Response> {
    const rawRes = (await invoke("signup", authData.toJson())) as string;
    return Response.fromJson(JSON.parse(rawRes));
  }

  logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.reload();
  }

  isLoggedIn() {
    if (
      !this.jwtHelper.isTokenExpired(this.getTokenLS()) ||
      !this.jwtHelper.isTokenExpired(this.getTokenSS())
    ) {
      return true;
    }
    if (this.jwtHelper.isTokenExpired(this.getTokenLS())) {
      localStorage.removeItem("token");
      return false;
    } else if (this.jwtHelper.isTokenExpired(this.getTokenSS())) {
      sessionStorage.removeItem("token");
      return false;
    }
    return false;
  }

  getTokenLS() {
    return localStorage.getItem("token");
  }

  getTokenSS() {
    return sessionStorage.getItem("token");
  }

  getToken() {
    return this.getTokenLS() || this.getTokenSS();
  }

  hasRole(role: string) {
    return this.getValueByKey("role").indexOf(role) !== -1;
  }

  getValueByKey(key: string) {
    const token = this.getToken();
    if (token && token != "") {
      const decoded: { [key: string]: any } | null =
        this.jwtHelper.decodeToken(token);
      if (decoded) {
        return decoded['data'][key];
      }
    }
    return null;
  }
}
