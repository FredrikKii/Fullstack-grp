import { MongoClient, Db, Collection, WithId, ObjectId } from "mongodb";
import { User } from "../models/user.js";
import dotenv from 'dotenv';


// Ladda miljövariabler från .env-filen
dotenv.config();

// Hämta connectionstringen
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

// Hämta ALLA users
export async function getAllUsers(): Promise<WithId<User>[]> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("user");
    return await usersCollection.find().toArray();

}

// Hämta EN specifik user
export async function getUserById(id: ObjectId): Promise<WithId<User> | null> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("user");
    return await usersCollection.findOne({ _id: id });

	// async function getHatById(id: ObjectId): Promise<WithId<Hat> | null> {
	// 	const col = await connectToDatabaseFindHats();
	// 	const hat = await col.findOne({ _id: id }); // Use ObjectId directly in the query
	// 	return hat;
	// }
}

// Skapa ny user
export async function createUser(user: User): Promise<User> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("user");
    user._id = currentId++; // Tilldela nytt ID
    await usersCollection.insertOne(user);
    return user; // Returera användaren med det tilldelade ID:t
}

// Uppdatera user
export async function updateUser(userId: number, user: User): Promise<any> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("user");
    return await usersCollection.updateOne({ _id: userId }, { $set: user });
}

// Ta bort user
export async function deleteUser(userId: number): Promise<any> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("user");
    return await usersCollection.deleteOne({ _id: userId });
}

// Sök efter user
export async function searchUsers(query: string): Promise<User[]> {
    const db = await getDb();
    const usersCollection: Collection<User> = db.collection("user");
    return await usersCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
}
