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
import { validateCart } from "../validation/validation.js";

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
router.get("/:id", async (req: Request, res: Response<WithId<Cart> | null>) => {
    const id: string = req.params.id;

    try {
        const cart = await getOneCart(id);
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
    const { error, value: newCart } = validateCart(req.body);
    
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

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
router.delete("/:id", async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        if (!ObjectId.isValid(id)) {
            return res.sendStatus(400);
        }

        const deletedId = await deleteOneCart(id);
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

// PUT uppdatera en befintlig cart
router.put("/:id", async (req: Request, res: Response) => {
    const { error, value: updatedCart } = validateCart(req.body);
    
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    const id: string = req.params.id;

    try {
        const updatedId = await updateOneCart(id, updatedCart);
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
