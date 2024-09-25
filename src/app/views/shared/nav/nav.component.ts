/* system libraries */
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { filter, Subject } from "rxjs";

/* materials */
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";

/* helpers */
import { Common } from "@helpers/common";

/* services */
import { AuthService } from "@services/auth.service";
import { ChatsService } from "@services/chats.service";
import { EventService } from "@services/event.service";

/* models */
import { Response } from "@models/response";
import { Chat } from "@models/chat";

/* components */
import { ShareWindowComponent } from "./share-window/share-window.component";
import { RenameTitleComponent } from "./rename-title/rename-title.component";
import {
  INotify,
  WindowNotifyComponent,
} from "../window-notify/window-notify.component";

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
    RenameTitleComponent,
    WindowNotifyComponent,
],
  templateUrl: "./nav.component.html",
})
export class NavComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private chatsService: ChatsService,
    private eventService: EventService
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

  currentTab: string = "";

  tempChat: Chat | null = null;

  isShowShareWindow: boolean = false;
  isShowRenameTitle: boolean = false;

  ngOnInit(): void {
    this.userId = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "user";

    this.eventService.listenRefresh$.subscribe(() => this.refresh());

    this.currentTab = this.router.url.split('/').pop() ?? '';
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((val) => {
        this.currentTab = this.router.url.split('/').pop() ?? '';
      });

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
        console.error(err);
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

  sort() {
    this.listChats.sort((a, b) =>
      new Date(a!.updatedAt).getTime() > new Date(b!.updatedAt).getTime()
        ? -1
        : 1
    );
  }

  openChat(event: any, chatId: string) {
    if (event.target.getAttribute('id') != "menuBut" && event.target.getAttribute('name') != "ellipsis-horizontal-outline") {
      this.router.navigate([`/chat/${chatId}`]);
    }
  }

  formatDate(date: string) {
    return Common.formatLocaleDate(date);
  }

  truncateString(str: string): string {
    return Common.truncateString(str, 18);
  }

  renameTitle() {
    this.chatsService
      .renameTitleChat(this.tempChat)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status == "success") {
          this.tempChat = data.data as Chat;
        }
        this.isShowRenameTitle = false;
      })
      .catch((err) => {
        console.error(err);
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

  shareChat(chatId: string) {
    if (chatId != "") {
      this.chatsService
        .shareChat(chatId)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success") {
            this.tempChat!.isPublic = true;
          }
        })
        .catch((err) => {
          console.error(err);
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
    if (chatId != "") {
      this.chatsService
        .closeChat(chatId)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success") {
            this.tempChat!.isPublic = false;
          }
        })
        .catch((err) => {
          console.error(err);
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
        if (data.status == "success") {
          this.refresh();
          this.router.navigate(["/"]);
        }
      })
      .catch((err) => {
        console.error(err);
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
