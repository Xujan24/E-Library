import { GoogleBooksService } from './../../../services/google-books.service';
import { BookeepingService } from './../../../services/bookeeping.service';
import { History } from './../../../models/history';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy{
  private historyCollection = 'history';
  historySubscription: Subscription;

  _isnull = true;
  historie$: History[];

  showSpinner = true;

  constructor(
    private bookeeping: BookeepingService
  ) { }

  ngOnInit() {
    this.bookeeping.getCurrentUserID().then(() => {
      this.getHistories();
    });
  }

  getHistories() {
    this.historySubscription = this.bookeeping.getHistory().subscribe(histories => {
      this.showSpinner = false;
      if (histories.length > 0) {
        this.historie$ = histories;
        this._isnull = false;
      }
    });
  }

  delete(id: string): void {
    this.bookeeping.removeRecord(this.historyCollection, id);

    if (this.historie$.length === 1) {
      this._isnull = true;
    }
  }

  ngOnDestroy() {
    this.historySubscription.unsubscribe();
  }

}
