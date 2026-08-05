import { MongoClient, type Db } from "mongodb";

interface MongoClientCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  var _mongoClientPromise: MongoClientCache | undefined;
}

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local or Vercel"
    );
  }
  return uri;
}

function getCached(): MongoClientCache {
  if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = { client: null, promise: null };
  }
  return globalThis._mongoClientPromise;
}

async function getClient(): Promise<MongoClient> {
  const cached = getCached();

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = new MongoClient(getUri(), {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      maxPoolSize: 5,
    }).connect();
  }

  cached.client = await cached.promise;
  return cached.client;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || "mr-wedding");
}
