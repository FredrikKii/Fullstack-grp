import { MongoClient, Db, Collection, WithId, ObjectId, InsertOneResult } from "mongodb";
import { Hat } from "../models/hats.js";
// Vet inte varför, men var tvungen att ha detta för att det skulle fungera.
import dotenv from "dotenv";
dotenv.config();

const con: string | undefined = process.env.CONNECTION_STRING;
// const test: string | undefined = process.env.TEST;


async function connectToDatabaseFindHats(): Promise<Collection<Hat>> {
    if (!con) {
        console.log("No connection string, check your .env file!");
        throw new Error("No connection string");
    }
    
    const client: MongoClient = await MongoClient.connect(con);
    const db: Db = await client.db("webshop");
    return db.collection<Hat>("hats"); 
}

// Hitta alla hattar
async function getAllHats(): Promise<WithId<Hat>[]> {
    const col = await connectToDatabaseFindHats(); 
    const result: WithId<Hat>[] = await col.find({}).toArray();
    return result;
}

// Hitta en hatt
async function getOneHat(name: string): Promise<WithId<Hat> | null> {
    const col = await connectToDatabaseFindHats(); 
    const result: WithId<Hat> | null = await col.findOne({name: name})
    return result;
}

// Lägg till hatt
async function insertOneHat(hat: Hat): Promise<ObjectId | null> {
    const col = await connectToDatabaseFindHats(); 
    const result: InsertOneResult<Hat> = await col.insertOne(hat);
    if (!result.acknowledged) {
        console.log("Could not insert hat!");
        return null;
    }
    return result.insertedId;
}

export { connectToDatabaseFindHats, getAllHats, getOneHat, insertOneHat };
