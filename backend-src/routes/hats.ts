import express, { Request, Response, Router } from "express";
import { Hat } from "../models/hats.js";
import { getAllHats, getOneHat } from "../database/hats.js";
import { WithId } from "mongodb";

export const router: Router = express.Router();

// GET x2, POST, PUT, DELETE
router.get("/", async (req: Request, res: Response<WithId<Hat>[]>) => {
    const allUsers: WithId<Hat>[] = await getAllHats();
    res.send(allUsers);
});

// Hämtar ut en hatt, använd hattnamnet som sökord.
router.get("/:name", async (req: Request, res: Response<WithId<Hat> | null>) => {
    
    const name: string = req.params.name;  

    try {
        const hat = await getOneHat(name);  
        if (hat) {
            res.send(hat); 
        } else {
            res.sendStatus(404);  
        }
    } catch (error) {
        res.sendStatus(500);  
    }
});