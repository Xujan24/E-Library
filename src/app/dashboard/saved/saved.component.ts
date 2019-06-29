import { DashboardComponent } from './../dashboard.component';
import { BookeepingService } from './../../../services/bookeeping.service';
import { SavedItems } from './../../../models/savedItems';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedComponent implements OnInit, OnDestroy {
  showSpinner = true;
  savedIemsSubscription: Subscription;
  _isnull = true;
  savedItem$: SavedItems[];

  constructor(
    private bookeeping: BookeepingService,
    private dashboard: DashboardComponent
  ) {}

  ngOnInit() {
    this.dashboard.showMenuItems = false;
    this.bookeeping.getCurrentUserID().then(() => {
      this.getAllSavedItems();
    });
  }

  getAllSavedItems() {
    this.savedIemsSubscription = this.bookeeping.getSavedItems().subscribe(items => {
      this.showSpinner = false;
      if(items.length > 0){
        this.savedItem$ = items;
        this._isnull = false;
      }
    });
  }

  delete(docID: string) {
    this.bookeeping.removeSavedItem(docID);
    if (this.savedItem$.length === 1) {
      this._isnull = true;
    }
  }

  ngOnDestroy() {
    this.savedIemsSubscription.unsubscribe();
  }

}
