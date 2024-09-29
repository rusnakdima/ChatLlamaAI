/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

/* models */
import { Response } from "@models/response";
import { User } from "@models/user";

/* services */
import { AuthService } from "@services/auth.service";
import { UsersService } from "@services/users.service";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-profile-form",
  standalone: true,
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: "./profile-form.component.html",
})
export class ProfileFormComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  dataNotify: Subject<INotify> = new Subject();

  @Output() submitEvent: EventEmitter<void> = new EventEmitter();
  @Output() closeWindowEvent: EventEmitter<any> = new EventEmitter();

  userID: string = "";
  role: string = "";

  user: User | null = null;

  ngOnInit() {
    document.addEventListener("keydown", (event: any) => {
      if (event.ctrlKey && event.key == "Enter") {
        event.preventDefault();
        this.onSubmit();
      }
    });

    this.userID = this.authService.getValueByKey("id") ?? "";
    this.role = this.authService.getValueByKey("role") ?? "user";

    this.usersService
      .getUserById(this.userID)
      .then((data: Response) => {
        if (data.status == "success") {
          this.user = data.data as User;
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

  changeImg(event: any) {
    if (this.user) {
      this.user.image = event.target.value;
    }
  }

  onSubmit() {
    if (this.user?.image == "") {
      this.user.image = "/assets/images/user.png";
    }

    this.usersService
      .updateUserImage(this.user)
      .then((data: Response) => {
        this.dataNotify.next({ status: data.status, text: data.message });
        if (data.status == "success") {
          localStorage.setItem("token", data.data);
          this.router.navigate(["/"]).then(() => {
            window.location.reload();
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
}
