import express, { Request, Response, Router } from 'express'
// TODO: validering, gärna i egen mapp: /backend-src/data/
import { Cookie } from '../models/cookie.js'
import { getAllCookies } from '../database/cookies.js'
import { WithId } from 'mongodb'

export const router: Router = express.Router()


// GET x2, POST, PUT, DELETE

router.get('/', async (req: Request, res: Response<WithId<Cookie>[]>) => {
	const allCookies: WithId<Cookie>[] = await getAllCookies()
	res.send(allCookies)  // 200
	// TODO: om tom lista, skicka 404 i stället för 200
	// Om något går fel kommer Express fånga det och svara med 500
})
