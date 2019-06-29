import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-cart-item-counter',
  templateUrl: './cart-item-counter.component.html',
  styleUrls: ['./cart-item-counter.component.scss']
})
export class CartItemCounterComponent implements OnInit, DoCheck {
  itemCount = 0;

  constructor(
    private cartServices: CartService
  ) { }

  ngOnInit() {
    this.getItemCounts();
  }

  ngDoCheck() {
    this.getItemCounts();
  }

  getItemCounts() {
    this.cartServices.getItemSize().subscribe(count => this.itemCount = count);
  }

}
