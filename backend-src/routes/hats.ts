import express, { Request, Response, Router } from "express";
import { Hat } from "../models/hats.js";
import { getAllHats, getOneHat, insertOneHat } from "../database/hats.js";
import { WithId } from "mongodb";

export const router: Router = express.Router();

// GET x2, POST, PUT, DELETE
router.get("/", async (req: Request, res: Response<WithId<Hat>[]>) => {
    const allUsers: WithId<Hat>[] = await getAllHats();
    res.send(allUsers);
});

// Hämtar ut en hatt, använd hattnamnet .
router.get("/:name", async (req: Request, res: Response<WithId<Hat> | null>) => {
    const name: string = req.params.name;  
    console.log("Name is: " + name);
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