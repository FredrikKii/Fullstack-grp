import express, { Request, Response, Router } from "express";
import { Hat } from "../models/hat-model.js";
import {
    getAllHats,
    getOneHat,
    insertOneHat,
    deleteOneHat,
    updateOneHat,
    searchHats,
} from "../database/hats.js";
import { ObjectId, WithId } from "mongodb";
import { validateHat, validateSearchQuery } from "../validation/validation.js";

export const router: Router = express.Router();

// GET x2, POST, PUT, DELETE
router.get("/", async (req: Request, res: Response<WithId<Hat>[]>) => {
    const allUsers: WithId<Hat>[] = await getAllHats();
    res.send(allUsers);
});

// Sök upp en hatt/ användare
router.get("/search", async (req: Request, res: Response) => {
    const name: string = req.query.q as string;
    console.log("Searched name: " + name);
    try {
        const hats = await searchHats(name);
        if (hats) {
            res.send(hats);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Hämtar ut en hatt, använd hattnamnet .
router.get("/:id", async (req: Request, res: Response<WithId<Hat> | null>) => {
    const id: string = req.params.id;
    console.log("ID is: " + id);
    try {
        const hat = await getOneHat(id);
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

// POST: Lägga till en hatt
router.post("/", async (req: Request, res: Response) => {
    const { error } = validateHat(req.body); 
    if (error) {
        return res.status(400).send(error.details[0].message); 
    }

    const newHat: Hat = req.body;
    try {
        const insertedId = await insertOneHat(newHat);
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


// Tar bort hatt
router.delete("/:id", async (req: Request, res: Response) => {
    const hatId: string = req.params.id;
    console.log("Request to delete hat with ID:", hatId);

    try {
        if (!ObjectId.isValid(hatId)) {
            return res.sendStatus(400);
        }

        const deletedId = await deleteOneHat(new ObjectId(hatId));

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

// PUT: Uppdatera en befintlig användare
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
        const result = await updateOneHat(id, updatedHat);
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
