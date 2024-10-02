import { ObjectId } from "mongodb";

export interface Hat extends Document {
    _id: ObjectId;
    name: string;
    price: number;
    image: string;
    amountInStock: number;
}
