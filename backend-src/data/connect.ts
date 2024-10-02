import { MongoClient, Db, Collection } from "mongodb";

// TODO: Try to fix so we dont need this
import dotenv from "dotenv";
dotenv.config();

// Connection string
const con: string | undefined = process.env.CONNECTION_STRING;

// Connect to database
async function connectToDatabase<T extends Document>(
    collectionName: string
): Promise<Collection<T>> {
    if (!con) {
        console.log("No connection string, check your .env file!");
        throw new Error("No connection string");
    }

    const client: MongoClient = await MongoClient.connect(con);
    const db: Db = await client.db("webshop");
    return db.collection<T>(collectionName);
}

export { connectToDatabase };
