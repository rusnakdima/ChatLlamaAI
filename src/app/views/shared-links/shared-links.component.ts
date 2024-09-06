/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { Subject } from "rxjs";

/* helpers */
import { Common } from "@helpers/common";

/* models */
import { Response } from "@models/response";
import { PublicChatFull } from "@models/public_chat_full";

/* services */
import { AuthService } from "@services/auth.service";
import { SharedLinksService } from "@services/shared-links.service";

/* components */
import { SearchComponent } from "@views/shared/fields/search/search.component";
import { ShowItemComponent } from "@views/shared/fields/show-item/show-item.component";
import { PaginationComponent } from "@views/shared/pagination/pagination.component";
import { SharedLinksFormComponent } from "./shared-links-form/shared-links-form.component";
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-shared-links",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    SearchComponent,
    ShowItemComponent,
    PaginationComponent,
    SharedLinksFormComponent,
    WindowNotifyComponent,
  ],
  templateUrl: "./shared-links.component.html",
})
export class SharedLinksComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private sharedLinksService: SharedLinksService
  ) {}

  dataNotify: Subject<INotify> = new Subject();

  [key: string]: any;

  listSharedLinks: Array<PublicChatFull> | Array<null> = [
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
  tempListSharedLinks: Array<PublicChatFull> = [];
  selectedRecords: Array<string> = [];
  filterParams: Array<any> = [];

  userId: string = "";
  role: string = "";

  page: number = 1;
  perItem: number = 10;

  isLoading: boolean = true;
  isShowWindFilter: boolean = false;
  isShowWindowEdit: boolean = false;

  ngOnInit() {
    document.addEventListener("keydown", (event: any) => {
      if (
        (event.ctrlKey && event.shiftKey && event.key == "R") ||
        event.key == "F5"
      ) {
        event.preventDefault();
        this.refresh();
      }
    });

    this.userId = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "user";

    this.refresh();
  }

  async refresh() {
    let elem = document.querySelector("#refreshBut") as HTMLElement;
    if (elem != null) {
      elem.className = "animate-spin";
      setTimeout(() => {
        elem.className = "";
      }, 2000);
    }
    this.listSharedLinks = [
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
    this.isLoading = true;

    this.sharedLinksService
      .getAllPublicChats(this.userId)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status === "success") {
          this.tempListSharedLinks = data.data as Array<PublicChatFull>;
          this.isLoading = false;
          this.filter();
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

  filter() {
    this.listSharedLinks = this.tempListSharedLinks.slice();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onChangePerItem(event: any) {
    this.perItem = event;
  }

  searchFunc(data: any) {
    this.listSharedLinks = data;
  }

  formatDate(date: string) {
    return Common.formatLocaleDate(date);
  }

  truncateString(str: string): string {
    return Common.truncateString(str);
  }

  closeWindow(event: any) {
    this[event] = false;
  }

  selAll(event: any) {
    this.selectedRecords = [];
    if (event.target.checked) {
      this.listSharedLinks.forEach((elem: any) => {
        this.selectedRecords.push(elem.id);
      });
    }
  }

  selRec(id: any, event: any) {
    if (event.target.checked) {
      this.selectedRecords.push(id);
    } else {
      this.selectedRecords.splice(this.selectedRecords.indexOf(id), 1);
    }
  }

  addRec() {
    this.isShowWindowEdit = true;
  }

  deleteRecords() {
    for (let id of this.selectedRecords) {
      this.sharedLinksService
        .deletePublicChat(id)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success") {
            this.refresh();
          }
        })
        .catch((err: any) => {
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

    if (this.selectedRecords.length == 0) {
      this.dataNotify.next({
        status: "error",
        text: "Deletion error! Select entries to delete!",
      });
    }

    this.selectedRecords = [];
  }

  delete(id: string) {
    this.selectedRecords = [];
    this.selectedRecords.push(id);
    this.deleteRecords();
  }
}
