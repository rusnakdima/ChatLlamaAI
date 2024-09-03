import { HttpHeaders } from "@angular/common/http";

export const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': `Bearer ${(localStorage['token'] ?? sessionStorage['token']) ?? ''}`,
    'Content-Type': 'application/json',
    'X-Client-Hostname': window.location.host,
  })
};