/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Subject } from "rxjs";

/* models */
import { Response } from "@models/response";
import { Chat } from "@models/chat";
import { PublicChat } from "@models/public_chat";

/* services */
import { AuthService } from "@services/auth.service";
import { ChatsService } from "@services/chats.service";
import { SharedLinksService } from "@services/shared-links.service";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-shared-links-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./shared-links-form.component.html",
})
export class SharedLinksFormComponent implements OnInit {
  @Output() submitEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeWindow: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    private chatsService: ChatsService,
    private sharedLinksService: SharedLinksService
  ) {}

  dataNotify: Subject<INotify> = new Subject();

  inputLink: string = "";

  userId: string = "";
  role: string = "";

  chat: Chat | null = null;

  ngOnInit() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.closeWindow.emit("isShowWindowEdit");
      }
      if (event.ctrlKey && event.key === "Enter") {
        this.onSubmit();
      }
    });

    this.userId = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "user";
  }

  onSubmit() {
    if (this.inputLink.trim() === "") {
      this.dataNotify.next({
        status: "error",
        text: "You didn't provide a link!",
      });
      return;
    }

    this.chatsService
      .getChatById(this.inputLink)
      .then((data: Response) => {
        if (data.status == "success") {
          this.chat = data.data as Chat;
          if (!this.chat.isPublic) {
            this.dataNotify.next({
              status: "error",
              text: "The chat is not public! It is impossible to add it!",
            });
            return;
          }

          if (this.userId == "") {
            this.dataNotify.next({
              status: "error",
              text: "You are not authorized to add a public chat!",
            });
            return;
          }

          let publicChat: PublicChat = {
            id: "",
            userId: this.userId,
            chatId: this.chat.id,
            createdAt: new Date().toISOString(),
          };
          this.sharedLinksService
            .addPublicChat(publicChat)
            .then((data: Response) => {
              this.dataNotify.next({
                status: data.status,
                text: data.message,
              });

              if (data.status == "success") {
                this.inputLink = "";
                this.submitEvent.next();
              }
            })
            .catch((err) => {
              console.error(err);
              this.dataNotify.next({
                status: "error",
                text: `${
                  this.role == "admin"
                    ? err.status + " — " + err.message
                    : "Server error!"
                }`,
              });
            });
        } else {
          this.dataNotify.next({
            status: "error",
            text: data.message,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.dataNotify.next({
          status: "error",
          text: `${
            this.role == "admin"
              ? err.status + " — " + err.message
              : "Server error!"
          }`,
        });
      });
  }
}
