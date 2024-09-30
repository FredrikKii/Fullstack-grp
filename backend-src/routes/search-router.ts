import express, { Request, Response, Router } from "express";
import { Hat } from "../models/hat-model.js";
import { searchHats } from "../database/hats.js";
import { ObjectId, WithId } from "mongodb";

export const router: Router = express.Router();

// Sök upp en hatt/ användare
router.get("/", async (req: Request, res: Response) => {
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
