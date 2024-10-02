import express, { Request, Response, Router } from "express";
import { Hat } from "../models/hat-model.js";
import {
    getAllProducts,
    getProduct,
    insertProduct,
    deleteProduct,
    updateProduct,
    searchProduct,
} from "../database/hats.js";
import { ObjectId, WithId } from "mongodb";
import { validateHat, validateSearchQuery } from "../validation/validation.js";

export const router: Router = express.Router();

// GET: get all products
router.get("/", async (req: Request, res: Response<WithId<Hat>[]>) => {
    const allUsers: WithId<Hat>[] = await getAllProducts();
    res.send(allUsers);
});

// GET: search product
router.get("/search", async (req: Request, res: Response) => {
    const { error } = validateSearchQuery(req.query.q);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const name: string = req.query.q as string;
    try {
        const hats = await searchProduct(name);
        if (hats.length > 0) {
            res.send(hats);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// GET: get specific product
router.get("/:id", async (req: Request, res: Response<WithId<Hat> | null>) => {
    const id: string = req.params.id;
    console.log("ID is: " + id);
    try {
        const hat = await getProduct(id);
        if (hat) {
            res.send(hat);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// POST: add product
router.post("/", async (req: Request, res: Response) => {
    const { error } = validateHat(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const newHat: Hat = req.body;
    try {
        const insertedId = await insertProduct(newHat);
        if (insertedId) {
            res.status(201).send({ id: insertedId });
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error("Error inserting:", error);
        res.sendStatus(500);
    }
});

// DELETE: delete product
router.delete("/:id", async (req: Request, res: Response) => {
    const hatId: string = req.params.id;
    console.log("Request to delete hat with ID:", hatId);

    try {
        if (!ObjectId.isValid(hatId)) {
            return res.sendStatus(400);
        }

        const deletedId = await deleteProduct(new ObjectId(hatId));

        if (deletedId) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Error deleting hat:", error);
        res.sendStatus(500);
    }
});

// PUT: update product
router.put("/:id", async (req: Request, res: Response) => {
    const { error } = validateHat(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const updatedHat: Hat = req.body;
    const id: string = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.sendStatus(400);
    }

    try {
        const result = await updateProduct(id, updatedHat);
        if (result.modifiedCount > 0) {
            res.status(200).send({ id });
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Error updating:", error);
        res.sendStatus(500);
    }
});
