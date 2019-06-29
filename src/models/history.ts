/**
 * @description
 * Data model for recently viewed items
 * id?: string,
 * userId: string,
 * bookId: string,
 * authors: string[],
 * dateTime: Date
 */

export interface History{
    id?: string;
    userId: string;
    bookId: string;
    bookTitle: string;
    authors: string[];
    dateTime: Date;
}