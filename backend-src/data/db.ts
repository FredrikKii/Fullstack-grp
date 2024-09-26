import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectDB = async (): Promise<Db> => {
    if (db) return db; 
    const client = new MongoClient('your_mongodb_connection_string');
    await client.connect();
    db = client.db('webshop'); 
    console.log('Database connected successfully');
    return db;
};
