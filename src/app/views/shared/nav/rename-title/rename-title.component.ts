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
  selector: "app-rename-title",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: "./rename-title.component.html",
})
export class RenameTitleComponent {
  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  @Input() chat: Chat | null = null;
  @Output() submitEvent: EventEmitter<void> = new EventEmitter();
  @Output() closeWindowEvent: EventEmitter<any> = new EventEmitter();

  newTitle: string = '';

  ngOnInit() {
    document.addEventListener('keydown', (event: any) => {
      if (event.ctrlKey && event.key == 'Enter') {
        event.preventDefault();
        this.onSubmit();
      }
    });
  }

  changeTitle(event: any) {
    this.newTitle = event.target.value;
  }

  onSubmit() {
    if (this.chat && this.newTitle.trim() != '') {
      this.chat.title = this.newTitle;
      this.submitEvent.emit();
    } else {
      this.dataNotify.next({
        status: "error",
        text: "Please input a new title.",
      });
    }
  }
}
