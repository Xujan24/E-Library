import { Subscription } from 'rxjs';
import { GoogleBooksService } from './../../../services/google-books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  googleBooksSubscription: Subscription;
  isSmall = false;
  showSpinner = true;
  HttpError: boolean;

  queryString$ = '';
  author$ = '';
  subject$ = '';
  isbn$ = '';

  startIndex = 0;
  maxItems = 10;
  totalItem$ = 0;

  book$: any;

  constructor(
    private route: ActivatedRoute,
    private googleBooks: GoogleBooksService,
  ) {}

  ngOnInit() {
    this.getResults();
  }

  getResults(){
    this.HttpError = false;

    this.route.queryParams.subscribe(queryParams => {
      this.queryString$ = queryParams.q;
      this.author$ = queryParams.author;
      this.subject$ = queryParams.subject;
      this.isbn$ = queryParams.isbn;

      this.googleBooks.requestBooks(this.queryString$,
                                    this.author$,
                                    this.subject$,
                                    this.isbn$,
                                    this.startIndex,
                                    this.maxItems)
      .subscribe((results: any) => {
        this.showSpinner = false;
        if (results) {
          this.book$ = results.items;
          this.totalItem$ = results.totalItems;
        }
      },
      error => {
        this.showSpinner = false;
        this.HttpError = true;
      });
    });
  }

  onNewQeury(event: boolean) {
    this.HttpError = false;
    this.startIndex = 0;
  }

  previous() {
    this.showSpinner = true;
    if (this.startIndex >= this.maxItems) {
      this.startIndex = this.startIndex - this.maxItems;
      this.googleBooks.fetchNextPrevious(this.startIndex, this.maxItems)
      .subscribe((results: any) => {
        this.showSpinner = false;
        if (results) {
          this.book$ = results.items;
        }
      });
    }
  }

  next(){
    this.showSpinner = true;
    if ((this.startIndex + this.maxItems) >= this.maxItems) {
      this.startIndex = this.startIndex + this.maxItems;
      this.googleBooks.fetchNextPrevious(this.startIndex, this.maxItems)
      .subscribe((results: any) => {
        this.showSpinner = false;
        if (results) {
          this.book$ = results.items;
        }
      });
    }
  }

  ngOnDestroy(): void {
    console.log('search destroyed');
  }



}
