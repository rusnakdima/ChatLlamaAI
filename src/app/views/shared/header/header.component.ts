/* system libraries */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor() {}

  @Output() isShowNavEvent: EventEmitter<boolean> = new EventEmitter();

  themeVal: string = '';

  isShowNav: boolean = false;

  ngOnInit(): void {
    this.themeVal = localStorage.getItem('theme') ?? '';
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
}
