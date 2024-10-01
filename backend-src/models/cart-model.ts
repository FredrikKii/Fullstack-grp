import { ObjectId } from "mongodb";

export interface Cart {
    _id: ObjectId;          
    userId: string;      
    productId: string;   
    amount: number;        
}
