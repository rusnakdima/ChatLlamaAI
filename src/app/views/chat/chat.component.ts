/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Subject } from "rxjs";

/* helpers */
import { Common } from "@helpers/common";

/* services */
import { AuthService } from "@services/auth.service";
import { UsersService } from "@services/users.service";
import { ChatsService } from "@services/chats.service";
import { MessagesService } from "@services/messages.service";
import { MdParseService } from "@services/md-parse.service";

/* models */
import { Response } from "@models/response";
import { Chat } from "@models/chat";
import { Message } from "@models/message";
import { MessageFull } from "@models/message_full";
import { User } from "@models/user";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-chat",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService, ChatsService, UsersService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./chat.component.html",
})
export class ChatComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private usersService: UsersService,
    private mdParseService: MdParseService
  ) {}

  dataNotify: Subject<INotify> = new Subject();

  messages: Array<MessageFull> | Array<null> = [
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

  inputMessage: string = "";

  chatId: string = "";
  chat: Chat | null = null;

  userId: string = "";
  role: string = "";
  image: string = "";

  aiUser: User | null = null;

  ngOnInit() {
    document.addEventListener("keyup", (event: any) => {
      if (event.ctrlKey && event.key === "Enter") {
        this.sendMessage();
      }
    });

    this.userId = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "user";
    this.image =
      this.authService.getValueByKey("image") ?? "/assets/images/user.png";

    this.usersService
      .getUserById("80c9c4a6-9046-44e7-ba54-73d285ed8c78")
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status === "success") {
          this.aiUser = data.data as User;
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

    this.route.params.subscribe(async (params) => {
      if (params["id"]) {
        if (this.chatId != params["id"]) {
          this.messages = [null, null, null, null, null, null, null, null, null, null];
        }
        this.chatId = params["id"];
        this.getChatData();
        await new Promise((res) => setTimeout(res, 500));
        this.getMessages(this.chatId);
      }
    });

    this.route.queryParams.subscribe(async (params) => {
      if (params["from"] && params["from"] == "home") {
        this.messages = [];
        await new Promise((res) => setTimeout(res, 1500));
        this.askAi();
        this.router.navigate(['/chat/' + this.chatId]);
      }
    });
  }

  parseContent(content: string) {
    return this.mdParseService.parseData(content);
  }

  formatDateTime(date: string) {
    return Common.formatLocaleDate(date) +' '+ Common.formatTime(date);
  }

  getChatData() {
    this.chatsService
      .getChatById(this.chatId)
      .then(async (data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status === "success") {
          this.chat = data.data as Chat;
          if (this.chat.userId != this.userId && !this.chat.isPublic) {
            this.dataNotify.next({
              status: "error",
              text: "This chat is private! Access to it is prohibited!",
            });
            await new Promise((res) => setTimeout(res, 2000));
            this.router.navigate(["/"]);
            return;
          }
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

  getMessages(chatId: string) {
    this.messagesService
      .getMessagesByChatId(chatId)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status === "success") {
          this.messages = data.data as Array<MessageFull>;
          setTimeout(() => {
            const block = document.getElementById('blockMessages');
            if (block) {
              block.scrollTo({ top: block.scrollHeight });
            }
          }, 100);
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

  sendMessage() {
    if (this.inputMessage.trim() === "") {
      return;
    }

    let messageForm: Message = {
      id: "",
      chatId: this.chatId,
      content: this.inputMessage,
      userId: this.userId,
      createdAt: new Date().toISOString(),
    };

    this.messagesService
      .sendMessage(messageForm)
      .then((data: Response) => {
        if (data.status == "success") {
          this.inputMessage = "";
          if (data.data) {
            ; (this.messages as Array<MessageFull>).push(
              MessageFull.fromJson(data.data)
            );
            this.askAi();
            setTimeout(() => {
              const block = document.getElementById('blockMessages');
              if (block) {
                block.scrollTo({ top: block.scrollHeight });
              }
            }, 100);
          }
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
            this.role === "admin"
              ? err.status + " — " + err.message
              : "Server error!"
          }`,
        });
      });
  }

  askAi() {
    ; (this.messages as Array<MessageFull>).push(
      new MessageFull(
        "",
        this.chat!,
        "AI is thinking...",
        this.aiUser!,
        new Date().toISOString()
      )
    );

    this.messagesService
      .askAI(
        this.chatId,
        this.messages[this.messages.length - 1]!.content
      )
      .then((data: Response) => {
        if (data.status === "success") {
          this.messages.pop();
          (this.messages as Array<MessageFull>).push(
            MessageFull.fromJson(data.data)
          );
        } else {
          this.dataNotify.next({ status: data.status, text: data.message });
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
