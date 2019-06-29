/**
 * Service: CartService
 * Location: ./src/services/cart.services.ts
 * @author Santosh Purja Pun
 */

import { CartItem } from './../models/cartItem';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * @description
 * It provides all the services related to cart. Each book is added to an array of CartItem object;
 * which is then passed to the BookeepingServices and then are stored in the Firestore collection. For retaining;
 * the items added to the cart, by the user, each items is stored into the local storage with key 'cartItem'.;
 * And it's value is continuously updated along with the items array. The value in the local strage is removed;
 * on signout and is also removed in every login process to make sure no cartItem are left in the local storage.
 */

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[];

  constructor() {
    this.retriveValueFromLocalStorage();
  }

  /**
   * Function to retrive the value from the local stroage and set it to the items array
   */
  retriveValueFromLocalStorage() {
    this.items = [];
    const cartItems = (localStorage.getItem('cartItem') === null) ? [null] : localStorage.getItem('cartItem').split('~');
    cartItems.shift();
    if (cartItems.length > 0) {
      for ( const item of cartItems) {
      this.items.push(JSON.parse(item) as CartItem);
      }
    }
  }

  /**
   * Function to update the local storage data
   */
  updateLocalStorage() {
    // reset the localstorage current items
    localStorage.removeItem('cartItem');
    if (this.items.length > 0) {
      for (const item of this.items) {
        localStorage.setItem('cartItem', localStorage.getItem('cartItem') + '~' + JSON.stringify(item));
      }
    }
  }

  /**
   * Function to clear the local storage data
   */
  clearLocalStorage() {
    localStorage.removeItem('cartItem');
  }

  /**
   * Function to add an item to cart
   * @param item a single CartItem object
   */
  pushItem(item: CartItem) {
    this.items.push(item);
    localStorage.setItem('cartItem', localStorage.getItem('cartItem') + '~' + JSON.stringify(item));
  }

  /**
   * Function to retrive the size of the cart
   * @returns an observable of number of items in the cart
   */
  getItemSize(): Observable<number> {
    return of(this.items.length);
  }

  /**
   * function to remove an item from the cart
   * @param bookId book id
   */
  removeItem(bookId: string) {
    this.items = this.items.filter(item => item.bookId !== bookId);
  }

  /**
   * Function to retrive all the items in the cart
   * @returns Observable<CartItem[]>
   */
  getItems(): Observable<CartItem[]> {
    return of(this.items);
  }

  /**
   * Function to check if a book is already added to the cart or not
   * @param bookId book id
   * @returns false if already added; otherwise true;
   */
  isInCart(bookId): boolean {
    return this.items.filter(item => bookId === item.bookId).length === 0;
  }
}
