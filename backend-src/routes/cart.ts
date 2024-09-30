import express, { Request, Response, Router } from "express";
import { Cart } from "../models/cart-model.js"; 
import {
    getAllCarts,
    getOneCart,
    insertOneCart,
    deleteOneCart,
    updateOneCart,
} from "../database/cart.js"; 
import { ObjectId, WithId } from "mongodb";

export const router: Router = express.Router();

// GET alla carts
router.get("/", async (req: Request, res: Response<WithId<Cart>[]>) => {
    try {
        const allCarts: WithId<Cart>[] = await getAllCarts();
        res.send(allCarts);
    } catch (error) {
        console.error("Error fetching carts:", error);
        res.sendStatus(500);
    }
});

// GET specifik cart - userId
router.get("/:userId", async (req: Request, res: Response<WithId<Cart> | null>) => {
    const userId: string = req.params.userId;

    try {
        const cart = await getOneCart(userId);
        if (cart) {
            res.send(cart);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.sendStatus(500);
    }
});

// POST en ny cart
router.post("/", async (req: Request, res: Response) => {
    const newCart: Cart = req.body;

    try {
        const insertedId = await insertOneCart(newCart);
        if (insertedId) {
            res.status(201).send({ id: insertedId });
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error("Error inserting cart:", error);
        res.sendStatus(500);
    }
});

// DELETE en cart baserat på userId
router.delete("/:userId", async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    try {
        if (!ObjectId.isValid(userId)) {
            return res.sendStatus(400);
        }

        const deletedId = await deleteOneCart(new ObjectId(userId));
        if (deletedId) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.sendStatus(500);
    }
});

// PUT uppdatera en befintlig cart  baserad på userId
router.put("/:userId", async (req: Request, res: Response) => {
    const updatedCart: Cart = req.body;
    const userId: string = req.params.userId;

    try {
        const updatedId = await updateOneCart(userId, updatedCart);
        if (updatedId) {
            res.status(200).send({ id: updatedId });
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error("Error updating cart:", error);
        res.sendStatus(500);
    }
});

export default router;
