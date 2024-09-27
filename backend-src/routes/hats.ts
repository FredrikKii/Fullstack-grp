import express, { Request, Response, Router } from "express";
import { Hat } from "../models/hats.js";
import {
    getAllHats,
    getOneHat,
    insertOneHat,
    deleteOneHat,
    updateOneHat,
} from "../database/hats.js";
import { ObjectId, WithId } from "mongodb";

export const router: Router = express.Router();

// GET x2, POST, PUT, DELETE
router.get("/", async (req: Request, res: Response<WithId<Hat>[]>) => {
    const allUsers: WithId<Hat>[] = await getAllHats();
    res.send(allUsers);
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

// Lägger till hatt
router.post("/", async (req: Request, res: Response) => {
    const newHat: Hat = req.body;
    console.log("New hat data received:", newHat);

    try {
        const insertedId = await insertOneHat(newHat);
        if (insertedId) {
            res.status(201).send({ id: insertedId });
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error("Error inserrting:", error);
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

// Uppdaterar en befintlig keps
router.put("/:id", async (req: Request, res: Response) => {
    // Detta är vad användaren matar in i body:
    const updatedHat: Hat = req.body;

    // Detta är vilken användaren vill ändra
    const id: string = req.params.id;

    console.log("Updated hat data received:", updatedHat);

    try {
        const insertedId = await updateOneHat(id, updatedHat);
        if (insertedId) {
            res.status(201).send({ id: insertedId });
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error("Error inserrting:", error);
        res.sendStatus(500);
    }
});
