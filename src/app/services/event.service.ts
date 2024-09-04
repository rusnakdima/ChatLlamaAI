import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private refreshChat$ = new BehaviorSubject<any>('');

  listenRefresh$ = this.refreshChat$.asObservable();

  refreshChat(event: any) {
    this.refreshChat$.next(event);
  }
}
