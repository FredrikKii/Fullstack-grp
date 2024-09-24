// import
// konfigurera server
import express, { Express, NextFunction, Request, Response } from 'express'
import { router as cookieRouter } from './routes/cookies.js'
const app: Express = express()
const port = 1338

// middleware
// route handlers
app.use('/', (req: Request, res: Response, next: NextFunction) => {
	// TODO: add body middleware and print it
	console.log(`${req.method}  ${req.url}`, req.body)
	next()
})

app.use('/cookies', cookieRouter)


// starta servern
app.listen(port, () => {
	console.log('SERVER is listening on port ' + port)
})

