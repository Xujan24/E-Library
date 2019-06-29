import { Subscription } from 'rxjs';
import { BookeepingService } from './../../../services/bookeeping.service';
import { GoogleBooksService } from './../../../services/google-books.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  private googleBookSubscription: Subscription;

  showSpinner = true;
  isSmall = true;
  Book: any;
  HttpError: boolean;

  constructor(
    private route: ActivatedRoute,
    private googleBooks: GoogleBooksService,
    private bookeeping: BookeepingService
  ) {}

  ngOnInit() {
    this.getBookInfo();
  }

  getBookInfo(): void {
    this.HttpError = false;
    const bookID = this.route.snapshot.params.id;
    this.googleBookSubscription = this.googleBooks.requestBookDetails(bookID).subscribe(book => {
      this.showSpinner = false;
      if (book) {
        this.Book = book;
        this.bookeeping.getCurrentUserID().then(
          () => this.bookeeping.addHistory(this.Book.id, this.Book.volumeInfo.title, this.Book.volumeInfo.authors));
      }
    },
    error => {
      this.showSpinner = false;
      this.HttpError = true;
    });
  }

  ngOnDestroy() {
    this.googleBookSubscription.unsubscribe();
  }

}
