/**
 * @description
 * Data model for saved items
 * id?: string
 * userId: string,
 * bookId: string,
 * bookTitle: string,
 * authors: string,
 * dateTime: Date
 */

export interface SavedItems{
    id?: string;
    userId: string;
    bookId: string;
    bookTitle: string;
    authors: string[];
    dateTime: Date;
}