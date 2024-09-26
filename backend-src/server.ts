import express, { Express, NextFunction, Request, Response } from 'express'
import { router} from './routes/users.js'
import { MongoClient,Db, Collection } from "mongodb";


const app: Express = express()
const port = 1339

// middleware
// route handlers

app.use('/', (req: Request, res: Response, next: NextFunction) => {
	// Lägg till body
	// console.log(`${req.method}  ${req.url}`, req.body)
	next()
})

app.use('/user', router)
app.use('/cart', router);
app.use(express.json());

// starta servern
app.listen(port, () => {
	console.log('SERVER is listening on port ' + port)	
})

