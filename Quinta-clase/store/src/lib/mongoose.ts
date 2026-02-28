import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error("Define la variable de entorno MONGODB_URI en .env.local");
}

const mongoUri = MONGODB_URI;

type CachedMongoose = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

declare global {
	var _mongoose: CachedMongoose | undefined;
}

const cached: CachedMongoose = global._mongoose ?? {
	conn: null,
	promise: null,
};

if (!global._mongoose) {
	global._mongoose = cached;
}

export async function connectDB() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(mongoUri, { dbName: "Tienda" });
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

