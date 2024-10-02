import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); 

let db: Db;

export const connectDB = async (): Promise<Db> => {
    if (db) return db;
    const client = new MongoClient(process.env.CONNECTION_STRING as string); 
    await client.connect();
    db = client.db('webshop'); 
    console.log('Database connected successfully');
    return db;
};
