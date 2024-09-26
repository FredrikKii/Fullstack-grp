import { ObjectId } from 'mongodb'; 
import { connectDB } from '../data/db.js'; 

export interface Cart {
    _id: ObjectId;
    userId: ObjectId;
    productId: ObjectId;
    amount: number;
}
