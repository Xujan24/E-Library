import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit {

  _isSmall = false;

  @Input()
  set isSmall(isSmall: boolean) {
    this._isSmall = isSmall;
  }

  @Output() newQuery: EventEmitter<boolean> = new EventEmitter();

  advanceSearchForm = new FormGroup({
    title: new FormControl(''),
    author: new FormControl(''),
    subject: new FormControl(''),
    isbn: new FormControl('')
  });

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  formatQuery(str: string): string {
    if (str !== '' || str !== null) {
      return str.split(' ').join('+');
    }
    return '';

  }

  search(): void {
    const title = this.formatQuery(this.advanceSearchForm.get('title').value);
    const author = this.formatQuery(this.advanceSearchForm.get('author').value);
    const subject = this.formatQuery(this.advanceSearchForm.get('subject').value);
    const isbn = this.formatQuery(this.advanceSearchForm.get('isbn').value);

    this.router.navigate(['/dashboard/search'], {
      queryParams: {
        q: title,
        author,
        subject,
        isbn,
      }
    });
    this.newQuery.emit(true);
  }

}
