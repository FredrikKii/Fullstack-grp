import {
    WithId,
    ObjectId,
    InsertOneResult,
    DeleteResult,
    UpdateResult,
} from "mongodb";
import { Cart } from "../models/cart-model.js";
import { User } from "../models/user-model.js";
import { Hat } from "../models/hat-model.js";

import { connectToDatabase } from "../data/connect.js";

const cartCollection = await connectToDatabase<Cart>("carts");
const userCollection = await connectToDatabase<User>("user");
const productCollection = await connectToDatabase<Hat>("hats");

// Hämta alla carts
async function getAllCartProducts(): Promise<WithId<Cart>[]> {
    return cartCollection.find({}).toArray();
}

// hämta en cart baserat på userId
async function getCartProduct(id: string): Promise<WithId<Cart> | null> {
    return cartCollection.findOne({ _id: new ObjectId(id) });
}

//Add cart
async function insertCartProduct(cart: Cart): Promise<ObjectId | null> {
    const userId = new ObjectId(cart.userId);
    const userExists = await userCollection.findOne({ _id: userId });
    if (!userExists) {
        throw new Error("User does not exist.");
    }

    const productId = new ObjectId(cart.productId);
    const productExists = await productCollection.findOne({ _id: productId });
    if (!productExists) {
        throw new Error("Product does not exist.");
    }

    const result: InsertOneResult<Cart> = await cartCollection.insertOne(cart);
    return result.acknowledged ? result.insertedId : null;
}

// ta bort en cart
async function deleteCartProduct(
    cartItemId: ObjectId
): Promise<ObjectId | null> {
    const result: DeleteResult = await cartCollection.deleteOne({
        _id: cartItemId,
    });
    return cartItemId;
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
