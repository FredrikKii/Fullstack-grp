import { MongoClient, Db, Collection, WithId } from "mongodb";
import { Cookie } from "../models/cookie.js"

// Obs! CONNECTION_STRING hämtas från .env
const con: string | undefined = process.env.CONNECTION_STRING

async function getAllCookies(): Promise<WithId<Cookie>[]> {
	if( !con ) {
		console.log('No connection string, check your .env file!')
		throw new Error('No connection string')
	}
	const client: MongoClient = await MongoClient.connect(con)
	const db: Db = await client.db('exercises')
	const col: Collection<Cookie> = db.collection<Cookie>('cookies')

	const result: WithId<Cookie>[] = await col.find({}).toArray()
	return result
}

export { getAllCookies }
