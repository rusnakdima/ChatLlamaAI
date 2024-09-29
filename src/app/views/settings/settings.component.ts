/* sys lib */
import { CommonModule, Location } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

/* models */
import { Response } from "@models/response";

/* services */
import { AuthService } from "@services/auth.service";
import { MongodbService } from "@services/mongodb.service";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-settings",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./settings.component.html",
})
export class SettingsComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private mongodbService: MongodbService
  ) {}

  dataNotify: Subject<INotify> = new Subject();

  userId: string = "";
  role: string = "";
  typeDB: string = "";

  hasLocalDB: boolean = false;

  ngOnInit() {
    this.userId = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "";
    this.typeDB = localStorage.getItem("typeDB") ?? "";
    this.mongodbService
      .checkLocalDB()
      .then((data: Response) => {
        if (data.status == "success") {
          this.hasLocalDB = true;
        } else {
          this.hasLocalDB = false;
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

  back() {
    this.location.back();
  }

  changeType(event: any) {
    this.typeDB = event.target.checked ? "cloud" : "local";
    localStorage.setItem("typeDB", this.typeDB);
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
    });
  }

  importData() {
    if (this.userId != "") {
      this.mongodbService.import(this.userId)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
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
        text: "You are not logged in!",
      });
    }
  }

  exportData() {
    if (this.userId != "") {
      this.mongodbService.export(this.userId)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
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
        text: "You are not logged in!",
      });
    }
  }
}
