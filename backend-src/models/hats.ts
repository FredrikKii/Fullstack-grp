import { ObjectId } from "mongodb";

export interface Hat {
    name: string;
    price: number;
    image: string;
    amountInStock: number;
}
