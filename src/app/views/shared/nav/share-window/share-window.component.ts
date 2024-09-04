/* system libraries */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';

/* models */
import { Chat } from '@models/chat';

@Component({
  selector: 'app-share-window',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './share-window.component.html'
})
export class ShareWindowComponent {
  constructor() {}

  @Input() chat: Chat | null = null;
  @Output() shareChatEvent: EventEmitter<string> = new EventEmitter();
  @Output() closeChatEvent: EventEmitter<string> = new EventEmitter();
  @Output() closeWindowEvent: EventEmitter<any> = new EventEmitter();

  shareChat() {
    this.shareChatEvent.emit(this.chat?.id ?? '');
  }

  closeChat() {
    this.closeChatEvent.emit(this.chat?.id ?? '');
  }
}
