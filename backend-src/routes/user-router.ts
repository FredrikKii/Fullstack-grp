import express, { Request, Response, Router } from "express";
import { User } from "../models/user-model.js";
import {
    getAllUsers,
    getOneUser,
    insertOneUser,
    deleteOneUser,
    updateOneUser,
	searchUsers,
} from "../database/users.js";
import { ObjectId, WithId } from "mongodb";

export const router: Router = express.Router();

// GET x2, POST, PUT, DELETE
router.get("/", async (req: Request, res: Response<WithId<User>[]>) => {
    const allUsers: WithId<User>[] = await getAllUsers();
    res.send(allUsers);
});

// Sök upp en användare
router.get("/search", async (req: Request, res: Response) => {
    const name: string = req.query.q as string;
    console.log("Searched name: " + name);
    try {
        const user = await searchUsers(name);
        if (user) {
            res.send(user);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Hämtar ut en user, använd user-id .
router.get("/:id", async (req: Request, res: Response<WithId<User> | null>) => {
    const id: string = req.params.id;
    console.log("ID is: " + id);
    try {
        const user = await getOneUser(id);
        if (user) {
            res.send(user);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Lägger till user
router.post("/", async (req: Request, res: Response) => {
    const newUser: User = req.body;
    console.log("New user data received:", newUser);

    try {
        const insertedId = await insertOneUser(newUser);
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

// Tar bort user
router.delete("/:id", async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    console.log("Request to delete hat with ID:", userId);

    try {
        if (!ObjectId.isValid(userId)) {
            return res.sendStatus(400);
        }

        const deletedId = await deleteOneUser(new ObjectId(userId));

        if (deletedId) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.sendStatus(500);
    }
});

// Uppdaterar en befintlig user
router.put("/:id", async (req: Request, res: Response) => {
    // Detta är vad användaren matar in i body:
    const updatedUser: User = req.body;

    // Detta är vilken användaren vill ändra
    const id: string = req.params.id;

    console.log("Updated user data received:", updatedUser);

    try {
        const insertedId = await updateOneUser(id, updatedUser);
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
