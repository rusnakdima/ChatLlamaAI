/* system libraries */
import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Subject } from "rxjs";

/* material */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";

/* services */
import { AuthService } from "@services/auth.service";
import { ChatsService } from "@services/chats.service";
import { UsersService } from "@services/users.service";

/* models */
import { Response } from "@models/response";
import { PublicChatFull } from "@models/public_chat_full";
import { Profile } from "@models/profile";
import { Chat } from "@models/chat";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-filter",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService, ChatsService, provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./filter.component.html",
})
export class FilterComponent implements OnInit {
  @Input() listSharedLinks: Array<PublicChatFull> | Array<null> = [];
  @Input() filterParams: Array<{ id: string; title: string; type: string }> =
    [];

  @Output() closeWindow: EventEmitter<string> = new EventEmitter<string>();
  @Output() setFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private authService: AuthService,
    private chatsService: ChatsService,
    private usersService: UsersService
  ) {}

  dataNotify: Subject<INotify> = new Subject();

  rangeDateForm: FormGroup = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  listStatus: Array<any> = [
    { id: "private", name: "Private" },
    { id: "public", name: "Public" },
  ];
  listChats: Array<Chat> = [];
  listProfiles: Array<Profile> = [];
  listSorts: Array<{ id: string; title: string }> = [
    { id: "owner", title: "Owner" },
    { id: "added", title: "Added Date" },
    { id: "created", title: "Created Date" },
  ];

  sortBy: { id: string; title: string } = this.listSorts[0];
  sortDir: { id: string; title: string } = { id: "asc", title: "Asc" };

  userId: string = "";
  role: string = "";

  ngOnInit(): void {
    this.userId = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "user";

    if (this.filterParams.findIndex((p) => p.type === "sortBy") == -1) {
      this.filterParams.push({
        id: this.listSorts[0].id,
        title: this.listSorts[0].title,
        type: "sortBy",
      });
    } else {
      this.sortBy.id = this.filterParams .find((p) => p.type === "sortBy")!.id.toString();
      this.sortBy.title = this.filterParams.find( (p) => p.type === "sortBy")!.title;
    }

    if (this.filterParams.findIndex((p) => p.type === "sortDir") == -1) {
      this.filterParams.push({
        id: this.sortDir.id,
        title: this.sortDir.title,
        type: "sortDir",
      });
    } else {
      this.sortDir.id = this.filterParams .find((p) => p.type === "sortDir")!.id.toString();
      this.sortDir.title = this.filterParams.find((p) => p.type === "sortDir")!.title;
    }

    if (this.filterParams.findIndex((p) => p.type === "dates") > -1) {
      const param = this.filterParams.find((p) => p.type === "dates");
      if (param) {
        const startDate = new Date(
          new Date(param["id"].split("_-_")[0]).toLocaleDateString()
        );
        const endDate = new Date(
          new Date(param["id"].split("_-_")[1]).toLocaleDateString()
        );
        this.rangeDateForm.setValue({
          startDate: startDate,
          endDate: endDate,
        });
      }
    }

    this.chatsService
      .getChatsByUserId(this.userId)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status == "success") {
          this.listChats = data.data as Array<Chat>;
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

    this.usersService
      .getUsersByChats(this.userId)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status == "success") {
          this.listProfiles = data.data as Array<Profile>;
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

  getFilterValueByType(type: string) {
    const param = this.filterParams.find((elem) => elem.type == type);
    if (!param) {
      return "all";
    }
    return param["id"];
  }

  setSortBy(event: any) {
    const value = event.target.value;
    switch (value) {
      case "owner":
        this.sortBy = { id: value, title: "Owner" };
        break;
      case "added":
        this.sortBy = { id: value, title: "Added Date" };
        break;
      case "created":
        this.sortBy = { id: value, title: "Created Date" };
        break;
      default:
        break;
    }

    if (this.filterParams.findIndex((p) => p.type === "sortBy") > -1) {
      this.filterParams.splice( this.filterParams.findIndex((p) => p.type === "sortBy"), 1 );
    }
    this.filterParams.push({
      id: this.sortBy.id,
      title: this.sortBy.title,
      type: "sortBy",
    });
  }

  setSortDir(event: any) {
    const value = event.target.value;
    switch (value) {
      case "asc":
        this.sortDir = { id: value, title: "Asc" };
        break;
      case "desc":
        this.sortDir = { id: value, title: "Desc" };
        break;
      default:
        break;
    }

    if (this.filterParams.findIndex((p) => p.type === "sortDir") > -1) {
      this.filterParams.splice( this.filterParams.findIndex((p) => p.type === "sortDir"), 1 );
    }
    this.filterParams.push({
      id: this.sortDir.id,
      title: this.sortDir.title,
      type: "sortDir",
    });
  }

  setOwner(id: any) {
    if (id != "all") {
      if (this.filterParams.findIndex((p) => p.type === "owner") > -1) {
        this.filterParams.splice( this.filterParams.findIndex((p) => p.type === "owner"), 1 );
      }
      const profile = this.listProfiles.find((elem) => elem.id == id);
      this.filterParams.push({
        id: id,
        title: profile!.username,
        type: "owner",
      });
    } else {
      this.filterParams.splice( this.filterParams.findIndex((p) => p.type === "owner"), 1 );
    }
  }

  setDates() {
    console.log(this.rangeDateForm.value);

    const startDate = this.rangeDateForm.controls["startDate"].value;
    const endDate = this.rangeDateForm.controls["endDate"].value;

    if (startDate && endDate) {
      if (this.filterParams.findIndex((p) => p.type === "dates") > -1) {
        this.filterParams.splice( this.filterParams.findIndex((p) => p.type === "dates"), 1 );
      }
      this.filterParams.push({
        id: `${new Date(startDate).toISOString()}_-_${new Date(
          endDate
        ).toISOString()}`,
        title: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        type: "dates",
      });
    } else {
      this.filterParams.splice( this.filterParams.findIndex((p) => p.type === "dates"), 1 );
    }
  }

  clearDates() {
    this.rangeDateForm.reset();
  }

  setStatus(id: any) {
    if (id != "all") {
      if (this.filterParams.findIndex((p) => p.type === "status") > -1) {
        this.filterParams.splice( this.filterParams.findIndex((p) => p.type === "status"), 1 );
      }
      this.filterParams.push({
        id: id,
        title: this.listStatus.find((elem) => elem.id == id)!["name"],
        type: "status",
      });
    } else {
      this.filterParams.splice( this.filterParams.findIndex((p) => p.type === "status"), 1 );
    }
  }

  apply() {
    this.setDates();
    this.setFilter.emit(this.filterParams);
  }
}
