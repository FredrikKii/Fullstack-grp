import express, { Request, Response, Router } from "express";
import { User } from "../models/user.js";
import { getAllUsers } from "../database/users.js";
import { WithId } from "mongodb";

export const router: Router = express.Router();

// GET x2, POST, PUT, DELETE
router.get("/", async (req: Request, res: Response<WithId<User>[]>) => {
    const allUsers: WithId<User>[] = await getAllUsers();
    res.send(allUsers);
	
});
