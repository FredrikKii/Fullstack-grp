import {
    WithId,
    ObjectId,
    InsertOneResult,
    DeleteResult,
    UpdateResult,
} from "mongodb";
import { Cart } from "../models/cart-model.js";

import { connectToDatabase } from "../data/connect.js";
const cartCollection = await connectToDatabase<Cart>("carts");

// Hämta alla carts
async function getAllCartProducts(): Promise<WithId<Cart>[]> {
    return cartCollection.find({}).toArray();
}

// hämta en cart baserat på userId
async function getCartProduct(id: string): Promise<WithId<Cart> | null> {
    return cartCollection.findOne({ _id: new ObjectId(id) });
}

// ny cart
async function insertCartProduct(cart: Cart): Promise<ObjectId | null> {
    const result: InsertOneResult<Cart> = await cartCollection.insertOne(cart);
    return result.acknowledged ? result.insertedId : null;
}

// ta bort en cart
async function deleteCartProduct(id: string): Promise<string | null> {
    const result: DeleteResult = await cartCollection.deleteOne({ id });
    return id;
}

// uppdatera en befintlig cart
async function updateCartProduct(id: string, updatedCart: Cart): Promise<any> {
    const result: UpdateResult<Cart> = await cartCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCart }
    );
    return result;
}

export {
    getAllCartProducts,
    getCartProduct,
    insertCartProduct,
    deleteCartProduct,
    updateCartProduct,
};
