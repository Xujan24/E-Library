import { DashboardComponent } from './../dashboard.component';
import { Subscription } from 'rxjs';
import { BookeepingService } from './../../../services/bookeeping.service';
import { BorrowItem } from './../../../models/BorrowItems';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-borrowed',
  templateUrl: './borrowed.component.html',
  styleUrls: ['./borrowed.component.scss']
})
export class BorrowedComponent implements OnInit, OnDestroy {
  private borrowedItemsSubscription: Subscription;
  showSpinner = true;
  _isnull = true;
  items: BorrowItem[];
  constructor(
    private bookeeping: BookeepingService,
    private dashboard: DashboardComponent
  ) { }

  ngOnInit() {
    this.dashboard.showMenuItems = false;
    this.getBorrowedItems();
  }

  getBorrowedItems(){
    this.bookeeping.getCurrentUserID().then(() => {
      this.borrowedItemsSubscription = this.bookeeping.getBorrowedItems().subscribe(items => {
        this.showSpinner = false;
        this.items = items;
        this._isnull = this.items.length <= 0;
      });
    });
  }

  return(docId) {
    this.bookeeping.returnItem(docId);
  }

  renew(docId){
    this.bookeeping.renewItem(docId);
  }

  ngOnDestroy() {
    this.borrowedItemsSubscription.unsubscribe();
  }

}
