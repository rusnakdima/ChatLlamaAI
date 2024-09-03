/* system libraries */
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter } from "rxjs";

/* services */
import { AuthService } from "@services/auth.service";

/* components */
import { HeaderComponent } from "@views/shared/header/header.component";
import { NavComponent } from "@views/shared/nav/nav.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, NavComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  url: string = "";

  isShowNav: boolean = false;

  ngOnInit(): void {
    const theme = localStorage.getItem("theme") ?? "";
    document.querySelector("html")!.setAttribute("class", theme);

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
  }

  showNav(value: boolean): void {
    this.isShowNav = value;
  }
}
