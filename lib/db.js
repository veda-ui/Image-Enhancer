import { MongoClient } from "mongodb";


let client;
let clientPromise;

if (!process.env.CONNECTIONSTRING) {
  throw new Error("Please add your MongoDB URI to the .env file");
}

const uri = process.env.CONNECTIONSTRING;
const options = {};

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

async function getDatabase() {
  const client = await clientPromise;
  return client.db("PBL"); // Ensure database name is correctly specified
}

export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

export default getDatabase;
