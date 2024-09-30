import express, { Express, NextFunction, Request, Response } from "express";
import { router } from "./routes/user-router.js";
import { router as hatsRouter } from "./routes/hat-router.js";
import { MongoClient, Db, Collection } from "mongodb";

const app: Express = express();
app.use(express.json());
const port = 2000;

// middleware
// route handlers
app.use("/", (req: Request, res: Response, next: NextFunction) => {
    // Lägg till body
    console.log(`${req.method}  ${req.url}`, req.body);
    next();
});

app.use("/api/users", router);
app.use("/api/hats", hatsRouter);

// starta servern
app.listen(port, () => {
    console.log("SERVER is listening on port " + port);
});
