/* system libraries */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  constructor() {}

  @Input() array: Array<any> = [];
  @Input() perItem: number = 0;

  @Output() onChange: EventEmitter<number> = new EventEmitter();

  page: number = 1;

  onTableDataChange(event: any) {
    this.page = event;
    this.onChange.next(this.page);
  }
}
