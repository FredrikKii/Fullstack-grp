import { MongoClient, Db, Collection, WithId } from "mongodb";
import { Hat } from "../models/hats.js";
// Vet inte varför, men var tvungen att ha detta för att det skulle fungera.
import dotenv from "dotenv";
dotenv.config();

const con: string | undefined = process.env.CONNECTION_STRING;
const test: string | undefined = process.env.TEST;

console.log(test);

async function getAllHats(): Promise<WithId<Hat>[]> {
    if (!con) {
        console.log("No connection string, check your .env file!");
        throw new Error("No connection string");
    }
    const client: MongoClient = await MongoClient.connect(con);
    const db: Db = await client.db("webshop");
    const col: Collection<Hat> = db.collection<Hat>("hats");
    const result: WithId<Hat>[] = await col.find({}).toArray();

    return result;
}

export { getAllHats };
