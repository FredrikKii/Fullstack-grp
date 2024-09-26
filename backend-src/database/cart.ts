import { Db, ObjectId } from 'mongodb';
import { Cart } from '../models/cart.js';
import { connectDB } from '../data/db.js';

export const findCartByUserId = async (userId: ObjectId) => {
    const db: Db = await connectDB();
    return db.collection('carts').findOne({ userId });
};

export const createCart = async (userId: ObjectId, productId: ObjectId, amount: number) => {
    const db: Db = await connectDB();
    const newCart: Cart = {
        _id: new ObjectId(), // Ny ObjectId
        userId,
        items: [{ productId, amount }] // Items är nu en array av CartItem
    };
    await db.collection('carts').insertOne(newCart);
    return newCart;
};

export const updateCartItems = async (userId: ObjectId, items: Cart['items']) => {
    const db: Db = await connectDB();
    await db.collection('carts').updateOne({ userId }, { $set: { items } });
    return findCartByUserId(userId);
};
