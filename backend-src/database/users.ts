import { MongoClient, Db, Collection, WithId, ObjectId, InsertOneResult, DeleteResult } from "mongodb";
import { User } from "../models/user.js";
// Vet inte varför, men var tvungen att ha detta för att det skulle fungera.
import dotenv from "dotenv";
dotenv.config();

const con: string | undefined = process.env.CONNECTION_STRING;
// const test: string | undefined = process.env.TEST;


async function connectToDatabaseFindUsers(): Promise<Collection<User>> {
    if (!con) {
        console.log("No connection string, check your .env file!");
        throw new Error("No connection string");
    }

    const client: MongoClient = await MongoClient.connect(con);
    const db: Db = await client.db("webshop");
    return db.collection<User>("user"); 
}

// Hitta alla users
async function getAllUsers(): Promise<WithId<User>[]> {
    const col = await connectToDatabaseFindUsers(); 
    const result: WithId<User>[] = await col.find({}).toArray();
    return result;
}

// Hitta en user
async function getOneUser(id: string): Promise<WithId<User> | null> {
    const col = await connectToDatabaseFindUsers(); 
    const result: WithId<User> | null = await col.findOne({ _id: new ObjectId(id) });
    return result;
}

// Lägg till user
async function insertOneUser(user: User): Promise<ObjectId | null> {
    const col = await connectToDatabaseFindUsers(); 
    const result: InsertOneResult<User> = await col.insertOne(user);
    if (!result.acknowledged) {
        console.log("Could not insert user!");
        return null;
    }
    return result.insertedId;
}

// Ta bort en user
async function deleteOneUser(userId: ObjectId): Promise<ObjectId | null> {
    const col = await connectToDatabaseFindUsers(); 
    const result: DeleteResult = await col.deleteOne({ _id: userId }); 

    return userId; 
}

export { connectToDatabaseFindUsers, getAllUsers, getOneUser, insertOneUser, deleteOneUser};