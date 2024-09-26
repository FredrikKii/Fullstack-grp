import { ObjectId } from 'mongodb'; 

export interface CartItem {
    productId: ObjectId;
    amount: number;
}

export interface Cart {
    _id: ObjectId;
    userId: ObjectId;
    items: CartItem[]; // Array of CartItem
}
