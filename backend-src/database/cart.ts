import {
    MongoClient,
    Db,
    Collection,
    WithId,
    ObjectId,
    InsertOneResult,
    DeleteResult,
    UpdateResult,
} from "mongodb";
import { Cart } from "../models/cart-model.js";
import dotenv from "dotenv";

dotenv.config();

const con: string | undefined = process.env.CONNECTION_STRING;

async function connectToDatabase(): Promise<Collection<Cart>> {
    if (!con) {
        console.log("No connection string, check your .env file!");
        throw new Error("No connection string");
    }

    const client: MongoClient = await MongoClient.connect(con);
    const db: Db = await client.db("webshop");
    return db.collection<Cart>("carts");
}

// Hämta alla carts
async function getAllCarts(): Promise<WithId<Cart>[]> {
    const col = await connectToDatabase();
    return col.find({}).toArray();
}

// Hämta en cart baserat på userId
async function getOneCart(userId: string): Promise<WithId<Cart> | null> {
    const col = await connectToDatabase();
    return col.findOne({ userId: userId });
}

// Ny cart
async function insertOneCart(cart: Cart): Promise<ObjectId | null> {
    const col = await connectToDatabase();
    const result: InsertOneResult<Cart> = await col.insertOne(cart);
    return result.acknowledged ? result.insertedId : null;
}

// Ta bort en cart
async function deleteOneCart(userId: string): Promise<string | null> {
    const col = await connectToDatabase();
    const result: DeleteResult = await col.deleteOne({ userId });
    return userId; // Här kanske du vill returnera result.deletedCount om du vill ha mer info
}

// Uppdatera en befintlig cart
async function updateOneCart(userId: string, updatedCart: Cart): Promise<any> {
    const col = await connectToDatabase();
    const result: UpdateResult<Cart> = await col.updateOne(
        { userId: userId }, // Ingen konvertering till ObjectId här
        { $set: updatedCart }
    );
    return result.modifiedCount > 0 ? userId : null;
}

export {
    getAllCarts,
    getOneCart,
    insertOneCart,
    deleteOneCart,
    updateOneCart,
};
