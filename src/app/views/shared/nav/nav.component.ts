/* system libraries */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

/* models */
import { Chat } from '@models/chat';

/* components */
import { WindowNotifyComponent } from '../window-notify/window-notify.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, HttpClientModule, RouterModule, WindowNotifyComponent],
  templateUrl: './nav.component.html'
})
export class NavComponent {
  constructor() {}

  listChats: Array<Chat> | Array<null> = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  ngOnInit(): void {
    // Fetch list of chats from your API or local storage
    // For example:
    // this.httpClient.get<Array<Chat>>(`https://api.example.com/chats`).subscribe(chats => this.listChats = chats);
  }
}
