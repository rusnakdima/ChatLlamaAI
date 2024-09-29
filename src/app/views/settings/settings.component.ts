/* sys lib */
import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
  ) {}

  typeDB: string = '';

  ngOnInit() {
    this.typeDB = localStorage.getItem('typeDB') ?? '';
  }

  back() {
    this.location.back();
  }

  changeType(event: any) {
    this.typeDB = event.target.checked ? "cloud" : "local";
    localStorage.setItem('typeDB', this.typeDB);
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
    });
  }
}
