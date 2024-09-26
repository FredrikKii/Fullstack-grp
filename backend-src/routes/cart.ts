import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from '../data/db.js';
import { CartItem } from '../models/cart.js'; // Importera CartItem

const router = Router();

router.get('/:userId', async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId);

    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { userId, productId, amount } = req.body; 

    try {
        const db = await connectDB();
        const newCart = {
            userId: new ObjectId(userId),  
            items: [{ productId: new ObjectId(productId), amount }] // Items är nu en array av CartItem
        };

        const result = await db.collection('carts').insertOne(newCart);
        const createdCart = await db.collection('carts').findOne({ _id: result.insertedId });

        res.status(201).json({ message: 'Cart created', cart: createdCart });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/increase/:userId/:productId', async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId);
    const productId = new ObjectId(req.params.productId);

    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productInCart = cart.items.find((item: CartItem) => item.productId.equals(productId)); // Ange typ

        if (productInCart) {
            productInCart.amount += 1;
        } else {
            cart.items.push({ productId, amount: 1 });
        }

        await db.collection('carts').updateOne({ userId }, { $set: { items: cart.items } });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/decrease/:userId/:productId', async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId);
    const productId = new ObjectId(req.params.productId);

    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ userId });

        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const productInCart = cart.items.find((item: CartItem) => item.productId.equals(productId)); // Ange typ
        
        if (productInCart) {
            productInCart.amount -= 1;

            if (productInCart.amount < 1) {
                return res.status(400).json({ error: 'Amount must be greater than 0' });
            }

            await db.collection('carts').updateOne({ userId }, { $set: { items: cart.items } });
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/remove/:userId/:productId', async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId);
    const productId = new ObjectId(req.params.productId);

    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ userId });

        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const productIndex = cart.items.findIndex((item: CartItem) => item.productId.equals(productId)); // Ange typ

        if (productIndex !== -1) {
            cart.items.splice(productIndex, 1);
            await db.collection('carts').updateOne({ userId }, { $set: { items: cart.items } });
            return res.status(200).json({ message: 'Product removed from cart' });
        } else {
            return res.status(404).json({ error: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
