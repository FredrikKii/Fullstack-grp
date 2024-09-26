import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectDB = async (): Promise<Db> => {
    if (db) return db; 
    const client = new MongoClient('mongodb+srv://fredrikkii:Freddan1991@cluster0.q07xi.mongodb.net/');
    await client.connect();
    db = client.db('webshop'); 
    console.log('Database connected successfully');
    return db;
};
