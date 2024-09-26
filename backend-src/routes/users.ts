import express, { Request, Response, Router } from "express";
import { User } from "../models/user.js";
import { getAllUsers, createUser, updateUser, deleteUser, searchUsers, getUserById } from "../database/users.js"; 
import { WithId } from "mongodb";

export const router: Router = express.Router();

// GET alla användare
router.get("/", async (req: Request, res: Response<WithId<User>[]>) => {
    const allUsers: WithId<User>[] = await getAllUsers();
    res.status(200).json(allUsers);
});

// GET specifik användare
router.get("/:_id", async (req: Request, res: Response) => {
    
    const user: WithId<User> | null = await getUserById(userId);
	const userId = req.params.id = new ObjectId(hatId); // Convert string to ObjectId
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send("User not found");
    }
});

// POST skapa ny användare
router.post("/", async (req: Request, res: Response) => {
    const newUser: User = req.body;
    const createdUser: User = await createUser(newUser);
    res.status(201).json(createdUser);
});

// PUT uppdatera användare
router.put("/:_id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id); // Omvandla till number
    const updatedUser: User = req.body;
    const result = await updateUser(userId, updatedUser);
    if (result.modifiedCount > 0) {
        res.status(200).send("User updated successfully");
    } else {
        res.status(404).send("User not found");
    }
});

// DELETE ta bort användare
router.delete("/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id); // Omvandla till number
    const result = await deleteUser(userId);
    if (result.deletedCount > 0) {
        res.status(200).send("User deleted successfully");
    } else {
        res.status(404).send("User not found");
    }
});

// GET sökning av användare
router.get("/search", async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query) {
        return res.status(400).send("Search query cannot be empty");
    }
    const users = await searchUsers(query);
    res.status(200).json(users);
});
