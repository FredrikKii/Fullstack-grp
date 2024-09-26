import { ObjectId } from "mongodb";

export interface Hat {
    _id: ObjectId; 
    name: string;
    price: number;
    image: string;
    amountInStock: number;
}
