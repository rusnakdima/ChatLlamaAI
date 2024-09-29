/* system libraries */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

/* materials */
import { MatMenuModule } from '@angular/material/menu';

/* services */
import { AuthService } from '@services/auth.service';

/* components */
import { ProfileFormComponent } from "./profile-form/profile-form.component";

@Component({
  selector: 'app-header',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, MatMenuModule, ProfileFormComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(
    private authService: AuthService
  ) {}

  @Output() isShowNavEvent: EventEmitter<boolean> = new EventEmitter();

  themeVal: string = '';

  username: string = '';
  role: string = '';
  image: string = '';

  isShowNav: boolean = false;
  isShowProfileWind: boolean = false;

  ngOnInit(): void {
    this.themeVal = localStorage.getItem('theme') ?? '';
    this.username = this.authService.getValueByKey("username") ?? '';
    this.role = this.authService.getValueByKey("role") ?? 'user';
    this.image = this.authService.getValueByKey("image") ?? '/assets/images/user.png';
  }

  showNav() {
    this.isShowNav = !this.isShowNav;
    this.isShowNavEvent.next(this.isShowNav);
  }

  setTheme(theme: string) {
    document.querySelector('html')!.setAttribute("class", theme);
    localStorage.setItem('theme', theme);
    this.themeVal = theme;
  }

  logout() {
    this.authService.logout();
  }
}
