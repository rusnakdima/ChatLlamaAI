/* system libraries */
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Subject } from "rxjs";

/* materials */
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from '@angular/material/tooltip';

/* services */
import { AuthService } from "@services/auth.service";
import { ChatsService } from "@services/chats.service";

/* models */
import { Response } from "@models/response";
import { Chat } from "@models/chat";

/* components */
import { ShareWindowComponent } from "./share-window/share-window.component";
import {
  INotify,
  WindowNotifyComponent,
} from "../window-notify/window-notify.component";
import { EventService } from "@services/event.service";

@Component({
  selector: "app-nav",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MatMenuModule,
    MatTooltipModule,
    ShareWindowComponent,
    WindowNotifyComponent,
  ],
  templateUrl: "./nav.component.html",
})
export class NavComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private chatsService: ChatsService,
    private eventService: EventService,
  ) {}

  dataNotify: Subject<INotify> = new Subject();

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

  userId: string = "";
  role: string = "";

  tempShareChat: Chat | null = null;

  isShowShareWindow: boolean = false;

  ngOnInit(): void {
    this.userId = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "user";

    this.eventService.listenRefresh$.subscribe(() => this.refresh() );

    this.refresh();
  }

  refresh() {
    this.chatsService
      .getChatsByUserId(this.userId)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status == "success") {
          this.listChats = data.data as Array<Chat>;
          this.sort();
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

  formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  sort() {
    this.listChats.sort((a, b) =>
      new Date(a!.createdAt).getTime() > new Date(b!.createdAt).getTime()
        ? -1
        : 1
    );
  }

  shareChat(chatId: string) {
    if (chatId != '') {
      this.chatsService
        .shareChat(chatId)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success") {
            this.tempShareChat!.isPublic = true;
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

  closeChat(chatId: string) {
    if (chatId != '') {
      this.chatsService
        .closeChat(chatId)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success") {
            this.tempShareChat!.isPublic = false;
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

  deleteChat(chatId: string) {
    this.chatsService
      .deleteChat(chatId)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status === "success") {
          this.refresh();
          this.router.navigate(['/']);
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
