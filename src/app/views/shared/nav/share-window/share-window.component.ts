/* system libraries */
import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { Subject } from "rxjs";

/* models */
import { Chat } from "@models/chat";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-share-window",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: "./share-window.component.html",
})
export class ShareWindowComponent {
  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  @Input() chat: Chat | null = null;
  @Output() shareChatEvent: EventEmitter<string> = new EventEmitter();
  @Output() closeChatEvent: EventEmitter<string> = new EventEmitter();
  @Output() closeWindowEvent: EventEmitter<any> = new EventEmitter();

  copyId() {
    navigator.clipboard.writeText(this.chat?.id ?? "");
    this.dataNotify.next({
      status: "success",
      text: "The chat ID has been successfully copied!",
    });
  }

  shareChat() {
    this.shareChatEvent.emit(this.chat?.id ?? "");
  }

  closeChat() {
    this.closeChatEvent.emit(this.chat?.id ?? "");
  }
}
