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
    _id: new ObjectId(),
    userId,
    productId,
    amount
  };
  await db.collection('carts').insertOne(newCart);
  return newCart;
};

export const updateCartItems = async (userId: ObjectId, items: Cart['amount']) => {
  const db: Db = await connectDB();
  await db.collection('carts').updateOne({ userId }, { $set: { amount: items } });
  return findCartByUserId(userId);
};
