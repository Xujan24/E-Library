/**
 * @description
 * Data model for cart items
 * id?: string,
 * userId: string,
 * bookId: string,
 * bookTitle: string,
 * authors: string[]
 */

export interface CartItem{
    id?: string;
    userId: string;
    bookId: string;
    bookTitle: string;
    authors: string[];
}