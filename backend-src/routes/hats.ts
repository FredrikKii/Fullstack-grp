import express, { Request, Response, Router } from "express";
import { Hat } from "../models/hats.js";
import { getAllHats } from "../database/hats.js";
import { WithId } from "mongodb";

export const router: Router = express.Router();

// GET x2, POST, PUT, DELETE
router.get("/", async (req: Request, res: Response<WithId<Hat>[]>) => {
    const allUsers: WithId<Hat>[] = await getAllHats();
    res.send(allUsers);
});
