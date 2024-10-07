import { ObjectId } from "mongodb";

export interface User extends Document {
    _id: ObjectId;
    name: string;
    isAdmin: boolean;
}
