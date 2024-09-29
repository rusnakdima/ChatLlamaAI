/* system libraries */
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter, Subject } from "rxjs";

/* models */
import { Response } from "@models/response";

/* services */
import { AuthService } from "@services/auth.service";
import { MongodbService } from "@services/mongodb.service";

/* components */
import { HeaderComponent } from "@views/shared/header/header.component";
import { NavComponent } from "@views/shared/nav/nav.component";
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NavComponent,
    WindowNotifyComponent,
  ],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private mongodbService: MongodbService
  ) {}

  dataNotify: Subject<INotify> = new Subject();

  url: string = "";
  role: string = "";

  isShowNav: boolean = false;

  ngOnInit() {
    const theme = localStorage.getItem("theme") ?? "";
    document.querySelector("html")!.setAttribute("class", theme);

    this.role = this.authService.getValueByKey('role') ?? 'user';

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((val) => {
        this.url = this.router.url.slice(
          0,
          this.router.url.indexOf("?") > -1
            ? this.router.url.indexOf("?")
            : this.router.url.length
        );
      });

    if (!localStorage.getItem("typeDB")) {
      this.mongodbService
        .checkLocalDB()
        .then((data: Response) => {
          if (data.status == "success") {
            localStorage.setItem("typeDB", "local");
          } else {
            localStorage.setItem("typeDB", "cloud");
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

  showNav(value: boolean): void {
    this.isShowNav = value;
  }
}
