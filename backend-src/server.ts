import express, { Express, NextFunction, Request, Response } from "express";
import { router } from "./routes/users.js";
import { router as hatsRouter } from "./routes/hats.js";
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

app.use("/user", router);
app.use("/hats", hatsRouter);

// starta servern
app.listen(port, () => {
    console.log("SERVER is listening on port " + port);
});
