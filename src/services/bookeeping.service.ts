/**
 * Service: BookeepingService
 * Location: ./src/services/bookeeping.services.ts
 * @author Santosh Purja Pun
 */
import { BorrowItem } from './../models/BorrowItems';
import { CartItem } from './../models/cartItem';
import { CartService } from './cart.service';
import { SavedItems } from './../models/savedItems';
import { UserAuthService } from './user-auth.service';
import { History } from './../models/history';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';

/**
 * @description
 * Provides all the services to interact with the Firebase Firesotre collections.
 * Three collections are user:
 * history: collection to store all the books viewed by the users;
 * saved: collection to store all the saved book items by the users;
 * borrowedItems: collection to store all the book items borrowed by the users;
 */

@Injectable({
  providedIn: 'root'
})
export class BookeepingService {
  // collections
  public historyCollection = 'history';
  public saveCollection = 'saved';
  public borrowCollection = 'borrowedItems';
  private userID = '';

  constructor(
    private afs: AngularFirestore,
    private userAuth: UserAuthService,
    private cart: CartService
  ) {}
  // ==========================================
  // HELPER FUNCTION
  // =========================================

  async getCurrentUserID() {
    await this.userAuth.getCurrentUser().then(user => {
      this.userID = user.uid;
    });
  }

  /**
   * function to query if a document with current userID and given bookID exists in a collection or not
   * @param collection name of the collection
   * @param bookID book id
   *
   * @returns an observable of type boolean. True if document exits and false otherwise
   */
  doesDocExists(collection: string, bookID: string): Observable<boolean> {
    const subject = new Subject<boolean>();

    this.afs.collection(collection, ref => ref.where('userId', '==', this.userID).where('bookId', '==', bookID).limit(1))
    .get()
    .subscribe(doc => {
      if (doc.empty) {
        subject.next(false);
      } else {
        subject.next(true);
      }
    });
    return subject.asObservable();
  }

  /**
   * function to add a new document to a collection with auto-ID;
   * @param collection collection name
   * @param Obj object to be added to the collection
   */

  addRecord(collection: string, Obj: any) {
    this.afs.collection(collection).add(Obj);
  }

  /**
   * Function to remove a specific document (referenced by the document id) from any collection.
   * @param collection name of the collection
   * @param id document id to delete
   */

  removeRecord(collection: string, id: string): void {
    this.afs.collection(collection).doc(id).delete();
  }

  /**
   * Function to retrive the document ID for a document
   * @param collection collection to search for
   * @param bookId book ID
   * @returns document id (string)
   */

  getDocID(collection: string, bookId: string): Observable<string> {
    return this.afs.collection(collection, ref => ref.where('userId', '==', this.userID).where('bookId', '==', bookId))
    .snapshotChanges().pipe(
      map(items => {
        if (items !== undefined) {
          return items[0].payload.doc.id;
        }
      })
    );
  }

  /**
   * Function to retrive a specific number of documents from a cocollection.
   * @param collection collection name
   * @param num number of items to return
   * @param orderBy attribute name to perform sorting
   * @param odr order; two possible values 'asc' and 'desc'; 'desc'(default)
   * @returns Observable<any[]>
   */
  getItems(collection: string, num: number, orderBy: string, odr: any = 'desc'): Observable<any[]> {
    return this.afs.collection(collection, ref => ref.where('userId', '==', this.userID).orderBy(orderBy, odr).limit(num))
    .valueChanges();
  }

  // ================================
  // FUNCTIONS FOR HISTORY
  // ================================

  /**
   * Function to add the viewed books as history
   * @param bookID unique bookID
   * @param bookTitle Book title
   * @param authors Book authors
   */

  addHistory(bookID: string, bookTitle: string, authors: string[]): void {
    try {
      // check if author exists or not
      const AUTHORS = (authors === undefined) ? ['unknown'] : authors;
      this.doesDocExists(this.historyCollection, bookID).subscribe(docExists => {
        if (!docExists) {
          const historyObj: History = {
          userId: this.userID,
          bookId: bookID,
          bookTitle,
          authors: AUTHORS,
          dateTime: new Date()
        };
          this.addRecord(this.historyCollection, historyObj);
        }
      });
    } catch (e) {
      console.log('Bookeeping Error:', e.message);
    }
  }

  /**
   * Function to request the history for the currently logged in user.
   * @param uid user id whose histry is requested
   * @returns an observable of History objects.
   */
  getHistory(): Observable<History[]> {
    return this.afs.collection(this.historyCollection, ref => ref.where('userId', '==', this.userID).orderBy('dateTime', 'desc'))
    .snapshotChanges().pipe(
      map(histories => {
        return histories.map( history => {
          const data = history.payload.doc.data() as History;
          const id = history.payload.doc.id;
          return {id, ...data};
        });
      }));
  }


  // ================================
  // FUNCTIONS FOR SAVE
  // ================================
  /**
   * Function to save the selected book item as saved
   * @param bookId book ID (string)
   * @param bookTitle book title (string)
   * @param authors book authors (string[])
   */
  saveItems(bookId: string, bookTitle: string, authors: string[]) {
    try {
      // check authors
      const AUTHORS = (authors === undefined) ? ['unknown'] : authors;
      this.doesDocExists(this.saveCollection, bookId).subscribe(isSaved => {
        if (!isSaved) {
          const saveItem: SavedItems = {
            userId: this.userID,
            bookId,
            bookTitle,
            authors: AUTHORS,
            dateTime: new Date()
          };
          this.addRecord(this.saveCollection, saveItem);
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  /**
   * Funtion to get all the saved items for the current user
   * @returns an observable of array of saved items object
   */
  getSavedItems(): Observable<SavedItems[]> {
    return this.afs.collection(this.saveCollection, ref => ref.where('userId', '==', this.userID).orderBy('dateTime', 'desc'))
    .snapshotChanges()
    .pipe(
      map(savedItems => {
        return savedItems.map( savedItem => {
          const data = savedItem.payload.doc.data() as History;
          const id = savedItem.payload.doc.id;
          return {id, ...data};
        });
      }));

  }

  /**
   * Function to remove a saved item
   * @param docId the document id of the selected document (string)
   */
  removeSavedItem(docId: string) {
    if (docId !== undefined) {
      this.removeRecord(this.saveCollection, docId);
    }
  }

  // ============================
  // FUNCTIONS FOR BORROW
  // ============================
  /**
   * Function to save the items in the cart to the firestore collection
   */
  saveCartItems() {
    this.cart.getItems().subscribe(items => {
      if (items) {
        for (const item of items) {
          const currentDate = new Date();
          const returndate = new Date().setMonth(new Date().getMonth() + 1);
          const currentItem: BorrowItem = {
            userId: this.userID,
            bookId: item.bookId,
            bookTitle: item.bookTitle,
            authors: item.authors,
            borrowDate: currentDate,
            returnDate: new Date(returndate),
            renewDate: currentDate,
            numRenew: 0,
            returned: false
          };

          this.addRecord(this.borrowCollection, currentItem);
        }
        this.cart.clearLocalStorage(); // clear the local storage
        this.cart.retriveValueFromLocalStorage(); // reset the items array
      }
    });
  }

  /**
   * Function to retrive all the borrowed books for the current user
   */
  getBorrowedItems(): Observable<BorrowItem[]> {
    return this.afs.collection(this.borrowCollection,
    ref => ref.where('userId', '==', this.userID).where('returned', '==', false).orderBy('borrowDate', 'asc'))
    .snapshotChanges()
    .pipe(
      map(items => {
        return items.map(item => {
          const data = item.payload.doc.data() as BorrowItem;
          const docId = item.payload.doc.id;
          return {docId, ...data};
        });
      })
    );
  }

  /**
   * Function to set the returned flag for the current document to true.
   * Current version doesn't delete the document for the returned book.
   * Instead sets the returned flag to true;
   * This might be important to add new features like show the recently borrowed books
   * that the user has already returned.
   * Or may be recommend the user new books based on his/her borrow history.
   * @param docId document id
   */
  returnItem(docId: string) {
    this.afs.collection(this.borrowCollection).doc(docId).update({returned: true});
  }

  /**
   * Function to perform renew.
   * Current version allows the user to renew books 5 times (maximum).
   * Once renew, 2 weeks will be added to the current return date and set is the new return date.
   * @param docId document id
   */
  renewItem(docId: string) {
    const maxRenewAllowed = 5;
    const noDays = 14;
    this.afs.collection(this.borrowCollection).doc<any>(docId).valueChanges().pipe(take(1)).subscribe((doc) => {
      if (doc.numRenew < maxRenewAllowed) {
        const currentReturnDate: Date = doc.returnDate.toDate();
        const newRenewDate = currentReturnDate.setDate(currentReturnDate.getDate() + noDays);
        this.afs.collection(this.borrowCollection).doc(docId).update({
          numRenew: doc.numRenew + 1,
          returnDate: new Date(newRenewDate),
          renewDate: new Date()
        });
      }
    });
  }

}
