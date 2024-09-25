import express, { Express, NextFunction, Request, Response } from 'express';
import { router } from './routes/users.js';

const app: Express = express();
const port = 1339;

// Middleware för att analysera JSON
app.use(express.json());

// Route handlerrrrs
app.use('/api/users', router);

// Om det blir fel
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Starta servern
app.listen(port, () => {
    console.log('SERVER is listening on port ' + port);	
});

