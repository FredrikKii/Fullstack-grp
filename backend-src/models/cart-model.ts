import { ObjectId } from "mongodb";

export interface Cart extends Document {
    _id: ObjectId;
    userId: string;
    productId: string;
    amount: number;
}
