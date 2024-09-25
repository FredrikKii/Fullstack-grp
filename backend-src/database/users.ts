import { MongoClient, Db, Collection, WithId } from "mongodb";
import { User } from "../models/user.js";
import dotenv from 'dotenv';

// Ladda miljövariabler från .env-filen
dotenv.config();

// Hämta connectionstring
const con: string | undefined = process.env.CONNECTION_STRING;
const dbName = "webshop"; 
const client = new MongoClient(con || "");
let currentId = 1; // För att hantera ID-inkrementering

async function getDb(): Promise<Db> {
    if (!con) {
        console.log("No connection string, check your .env file!");
        throw new Error("No connection string");
    }
    await client.connect();
    return client.db(dbName);
}

// Hämta alla users
export async function getAllUsers(): Promise<WithId<User>[]> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("users");
    return await usersCollection.find().toArray();
}

// Hämta en specifik user
export async function getUserById(userId: number): Promise<WithId<User> | null> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("users");
    return await usersCollection.findOne({ _id: userId });
}

// Skapa ny user
export async function createUser(user: User): Promise<User> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("users");
    user._id = currentId++; // Tilldela nytt ID
    await usersCollection.insertOne(user);
    return user; // Returera användaren med det tilldelade ID:t
}

// Uppdatera user
export async function updateUser(userId: number, user: User): Promise<any> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("users");
    return await usersCollection.updateOne({ _id: userId }, { $set: user });
}

// Ta bort user
export async function deleteUser(userId: number): Promise<any> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("users");
    return await usersCollection.deleteOne({ _id: userId });
}

// Sök efter user
export async function searchUsers(query: string): Promise<User[]> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("users");
    return await usersCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
}
