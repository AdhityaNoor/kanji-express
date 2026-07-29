import { MongoClient, type Db, type Collection } from 'mongodb'
import type { UserDoc } from './user.js'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'kanji_express'

// Cache the connection across warm serverless invocations.
declare global {
  // eslint-disable-next-line no-var
  var _keMongo: { promise: Promise<MongoClient> | null } | undefined
}

const cache = global._keMongo ?? (global._keMongo = { promise: null })

export async function getDb(): Promise<Db> {
  if (!uri) throw new Error('MONGODB_URI is not set')
  if (!cache.promise) {
    cache.promise = new MongoClient(uri, { maxPoolSize: 10 }).connect()
  }
  const client = await cache.promise
  return client.db(dbName)
}

let indexesEnsured = false

export async function users(): Promise<Collection<UserDoc>> {
  const db = await getDb()
  const col = db.collection<UserDoc>('users')
  if (!indexesEnsured) {
    indexesEnsured = true
    await col.createIndex({ email: 1 }, { unique: true }).catch(() => undefined)
  }
  return col
}
