import express, { Express, NextFunction, Request, Response } from "express";
import { router } from "./routes/user-router.js";
import { router as hatsRouter } from "./routes/hat-router.js";
import cartRouter from './routes/cart-router.js'; 
// import { router as searchRouter } from "./routes/search-router.js";
import { MongoClient, Db, Collection } from "mongodb";
import cors from 'cors';

const app: Express = express();
app.use(express.json());
app.use(cors());
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
app.use('/api/carts', cartRouter); 
// app.use("/api/hats/search", searchRouter);

// starta servern
app.listen(port, () => {
    console.log("SERVER is listening on port " + port);
});
