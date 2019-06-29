import { CartItem } from './../../../models/cartItem';
import { CartService } from './../../../services/cart.service';
import { BookeepingService } from './../../../services/bookeeping.service';
import { Location } from '@angular/common';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, OnDestroy {
  private docExistsSubscription: Subscription;
  private getDocIdSubscription: Subscription;
  private saveCollection = 'saved';

  _bookID = '';
  _bookTitle = '';
  _showViewDetails = false;
  _authors: string[];
  showSpinner = true;


  showSave: boolean;
  showAddCart = true;

  @Input()
  set bookID(bookID: string) {
    this._bookID = bookID;
  }

  @Input()
  set showViewDetails(showViewDetails: boolean) {
    this._showViewDetails = showViewDetails;
  }

  @Input()
  set bookTitle(bookTitle: string) {
    this._bookTitle = bookTitle;
  }

  @Input()
  set authors(authors: string[]) {
    this._authors = authors;
  }

  constructor(
    private router: Router,
    private _location: Location,
    private bookeeping: BookeepingService,
    private cart: CartService
  ) {}

  ngOnInit() {
    this.bookeeping.getCurrentUserID().then(() => {
      this.toggleShowBtn();
    });
    this.showAddCart = this.cart.isInCart(this._bookID);
  }

  toggleShowBtn() {
    this.docExistsSubscription = this.bookeeping.doesDocExists('saved', this._bookID).subscribe(exists => {
      this.showSpinner = false;
      this.showSave = !exists;
    });
  }

  viewClick() {
    this.router.navigate(['/dashboard/books', this._bookID]);
  }

  goBack() {
    this._location.back();
  }

  add_to_wish() {
    this.bookeeping.getCurrentUserID().then(() => {
      this.bookeeping.saveItems(this._bookID, this._bookTitle, this._authors);
      this.showSave = false;
    });
  }

  unsave(): void {
    this.getDocIdSubscription = this.bookeeping.getDocID(this.saveCollection, this._bookID).pipe(first()).subscribe(id => {
      this.bookeeping.removeSavedItem(id);
      this.showSave = true;
    });
  }

  add_to_cart() {
    const item: CartItem = {
      bookId: this._bookID,
      userId: '',
      authors: (this._authors !== undefined) ? this._authors : ['Unknown'],
      bookTitle: this._bookTitle,
    };
    this.cart.pushItem(item);
    this.showAddCart = false;
  }

  remove_from_cart() {
    this.cart.removeItem(this._bookID);
    this.showAddCart = true;
  }

  ngOnDestroy() {
    if (this.docExistsSubscription !== undefined) {
      this.docExistsSubscription.unsubscribe();
    }

    if (this.getDocIdSubscription !== undefined) {
      this.getDocIdSubscription.unsubscribe();
    }
  }

}
