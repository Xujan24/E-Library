import { BookeepingService } from './../../../services/bookeeping.service';
import { Subscription } from 'rxjs';
import { CartItem } from './../../../models/cartItem';
import { CartService } from './../../../services/cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  private cartItemsSubscription: Subscription;
  item$: CartItem[];
  showSpinner = true;
  _isnull = true;
  showItemAddedMessage: boolean;

  constructor(
    private cartServices: CartService,
    private bookeeping: BookeepingService
  ) { }

  ngOnInit() {
    this.getCartItems();
    this.showItemAddedMessage = false;
  }

  getCartItems() {
    this.showSpinner = true;
    this.cartItemsSubscription = this.cartServices.getItems().subscribe(items => {
      this.showSpinner = false;
      this.item$ = items;
      this._isnull = this.item$.length === 0;
    });
  }

  delete(bookId: string) {
    this.cartServices.removeItem(bookId);
    this.cartServices.updateLocalStorage();
    this.getCartItems();
  }

  submitRequest() {
    this.bookeeping.getCurrentUserID().then(() => {
      this.showItemAddedMessage = true;
      this.bookeeping.saveCartItems();
    });
  }

  ngOnDestroy() {
    this.cartItemsSubscription.unsubscribe();
  }

}
