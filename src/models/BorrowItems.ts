/**
 * @description
 * Data model for borrow items
 * docId?: string,
 * userId: string,
 * bookId: string,
 * bookTitle: string,
 * authors: string[],
 * borrowDate: Date,
 * returnDate: Date,
 * renewDate?: Date,
 * numRenew: number,
 * returned: boolean
 */

export interface BorrowItem {
    docId?: string;
    userId: string;
    bookId: string;
    bookTitle: string;
    authors: string[];
    borrowDate: Date;
    returnDate: Date;
    renewDate?: Date;
    numRenew: number;
    returned: boolean;
}