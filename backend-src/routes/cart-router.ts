import express, { Request, Response, Router } from "express";
import { Cart } from "../models/cart-model.js";
import {
    getAllCartProducts,
    getCartProduct,
    insertCartProduct,
    deleteCartProduct,
    updateCartProduct,
} from "../database/cart.js";
import { ObjectId, WithId } from "mongodb";
import { validateCart } from "../validation/validation.js";

export const router: Router = express.Router();

// GET: all cart products
router.get("/", async (req: Request, res: Response<WithId<Cart>[]>) => {
    try {
        const allCarts: WithId<Cart>[] = await getAllCartProducts();
        res.send(allCarts);
    } catch (error) {
        console.error("Error fetching carts:", error);
        res.sendStatus(500);
    }
});

// GET: specific cart product
router.get("/:id", async (req: Request, res: Response<WithId<Cart> | null>) => {
    const id: string = req.params.id;

    try {
        const cart = await getCartProduct(id);
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

// POST: add cart product
router.post("/", async (req: Request, res: Response) => {
    const { error } = validateCart(req.body);

    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    const newCartProduct: Cart = req.body;

    try {
        const insertedId = await insertCartProduct(newCartProduct);
        if (insertedId) {
            res.status(201).send({ id: insertedId });
        } else {
            res.sendStatus(400);
        }
    } catch (error: any) {
        if (
            error.message === "User does not exist." ||
            error.message === "Product does not exist."
        ) {
            return res.status(404).send({ error: error.message });
        }
        console.error("Error inserting cart:", error);
        res.sendStatus(500);
    }
});

// DELETE: delete cart product
router.delete("/:id", async (req: Request, res: Response) => {
    const cartItemid: string = req.params.id;

    try {
        if (!ObjectId.isValid(cartItemid)) {
            return res.sendStatus(400);
        }

        const deletedId = await deleteCartProduct(new ObjectId(cartItemid));
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

// PUT: update cart product
router.put("/:id", async (req: Request, res: Response) => {
    const { error, value: updatedCart } = validateCart(req.body);

    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    const id: string = req.params.id;

    try {
        const updatedId = await updateCartProduct(id, updatedCart);
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
