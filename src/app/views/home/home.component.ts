/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

/* services */
import { AuthService } from "@services/auth.service";
import { ChatsService } from "@services/chats.service";
import { EventService } from "@services/event.service";

/* models */
import { Response } from "@models/response";
import { Chat } from "@models/chat";
import { Message } from "@models/message";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-home",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private chatsService: ChatsService,
    private eventService: EventService
  ) {}

  dataNotify: Subject<INotify> = new Subject();

  inputMessage: string = "";

  userId: string = "";
  role: string = "";

  async ngOnInit() {
    document.addEventListener("keyup", (event: any) => {
      if (event.ctrlKey && event.key === "Enter") {
        this.sendMessage();
      }
    });

    this.userId = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "user";
  }

  sendMessage() {
    if (this.inputMessage.trim() === "") {
      return;
    }

    let chatForm: Chat = {
      id: "",
      title: `${this.inputMessage.slice(0, 25)}${this.inputMessage.length > 15 ? '...' : ''}`,
      userId: this.userId,
      createdAt: new Date().toISOString(),
      isPublic: false,
    };

    this.chatsService
      .createChat(chatForm)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status == "success") {
          this.eventService.refreshChat('');
          let messageForm: Message = {
            id: "",
            chatId: data.data,
            content: this.inputMessage,
            userId: this.userId,
            createdAt: new Date().toISOString(),
          };
          this.chatsService
            .sendMessage(messageForm)
            .then((data: Response) => {
              if (data.status === "success") {
                this.inputMessage = "";
                this.router.navigate(['/chats/' + data.data]);
              } else {
                this.dataNotify.next({
                  status: "error",
                  text: data.message,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.dataNotify.next({
                status: "error",
                text: `${
                  this.role === "admin"
                    ? err.status + " — " + err.message
                    : "Server error!"
                }`,
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        this.dataNotify.next({
          status: "error",
          text: `${
            this.role === "admin"
              ? err.status + " — " + err.message
              : "Server error!"
          }`,
        });
      });
  }
}
