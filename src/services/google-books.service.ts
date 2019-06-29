/**
 * Service: GoogleBooksService
 * Location: ./src/services/google-books.services.ts
 * @author Santosh Purja Pun
 */

import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

/**
 * @description
 * Google Books API services. Handles all the GET request to fetch books and book details
 * from Google Books.
 */

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private apiKey = '';

  // query parameters;
  private _queryText = '';
  private _author = '';
  private _subject = '';
  private _isbn = '';


  constructor(
    private http: HttpClient
  ) {
    this.apiKey = environment.googleBooksAPI;
  }

  /**
   * Function to send a GET request to perform a volumes search
   * @param query book title(optional, default = '')
   * @param author book author name (optional, default = '')
   * @param subject book subject or category (optional, default = '')
   * @param isbn book isbn (optional, default = '')
   * @param startIndex position in the collection at which to start (optional, default = 0)
   * @param maxResults maximum number of results to return (optional, default = 15)
   * @returns an observable of response object with an array of book information
   */
  requestBooks(query = '', author = '', subject = '', isbn = '', startIndex = 0, maxResults = 15) {
    try {
      // store request parameters
      this._queryText = query;
      this._author = author;
      this._subject = subject;
      this._isbn = isbn;

      let requestURI = `https://www.googleapis.com/books/v1/volumes?q=${this._queryText}`;
      if (this._author) {
        requestURI = requestURI.concat(`+inauthor:${this._author}`);
      }
      if (this._subject) {
        requestURI = requestURI.concat(`+subject:${this._subject}`);
      }
      if (this._isbn) {
        requestURI = requestURI.concat(`+isbn:${this._isbn}`);
      }
      requestURI = requestURI + `&startIndex=${startIndex}&maxResults=${maxResults}&key=${this.apiKey}`;
      return this.http.request('GET', requestURI);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * function to send a GET request to retrive a book specified by the bookID.
   * @param bookID book id (string, default = '')
   * @returns an observable of response object with the specified book information
   */
  requestBookDetails(bookID: string = '') {
    const bookURI = `https://www.googleapis.com/books/v1/volumes/${bookID}`;
    return this.http.request('GET', bookURI);
  }

  /**
   * Function to perform the pagination
   * @param startIndex position in the collection at which to start
   * @param maxResults total number of results to return
   * @returns Returns an observable of (maxResults number of) books.
   */
  fetchNextPrevious(startIndex: number, maxResults: number){
    try{
      if (startIndex < 0 || maxResults <= 0) {
        throw new Error('invalid start index or max results provided!');
      } else {
        return this.requestBooks(this._queryText, this._author, this._subject, this._isbn, startIndex, maxResults);
      }
    } catch (e) {

    }
  }
}
