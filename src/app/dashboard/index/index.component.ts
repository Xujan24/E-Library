import { UserAuthService } from './../../../services/user-auth.service';
import { BookeepingService } from './../../../services/bookeeping.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BorrowItem } from '../../../models/BorrowItems';
import { SavedItems } from '../../../models/savedItems';
import { History } from '../../../models/history';
import { take, first } from 'rxjs/operators';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  private numItems = 3; // number of items to show for borrowed items, saved items and history;

  borrowedItems: BorrowItem[];
  savedItems: SavedItems[];
  histories: History[];

  displayName: string;

  private borrowSubscription: Subscription;
  private savedSubscription: Subscription;
  private historySubscription: Subscription;


  constructor(
    private bookeeping: BookeepingService,
    private userAuth: UserAuthService,
  ) { }

  ngOnInit() {
    this.bookeeping.getCurrentUserID().then(
      () => {
        this.borrowSubscription = this.bookeeping.getItems(this.bookeeping.borrowCollection, this.numItems, 'borrowDate', 'desc')
        .subscribe(items => this.borrowedItems = items);

        this.savedSubscription = this.bookeeping.getItems(this.bookeeping.saveCollection, this.numItems, 'dateTime')
        .subscribe(items => this.savedItems = items);

        this.historySubscription = this.bookeeping.getItems(this.bookeeping.historyCollection, this.numItems, 'dateTime')
        .subscribe(items => this.histories = items);
      });

    this.userAuth.getCurrentUser().then(user => this.displayName = user.displayName);
  }

  ngOnDestroy() {
    if (this.borrowSubscription !== undefined){
      this.borrowSubscription.unsubscribe();
    }

    if (this.savedSubscription !== undefined){
      this.savedSubscription.unsubscribe()
    }

    if (this.historySubscription !== undefined){
      this.historySubscription.unsubscribe();
    }
  }

}
