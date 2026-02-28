import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

async function testMongoConnection() {
	try {
		await connectDB();
		await mongoose.connection.db?.admin().ping();

		return NextResponse.json(
			{
				ok: true,
				message: "Conexión a MongoDB exitosa",
				database: mongoose.connection.name,
			},
			{ status: 200 },
		);
	} catch (error) {
		const details = error instanceof Error ? error.message : "Error desconocido";

		return NextResponse.json(
			{ ok: false, error: "Error al conectar con MongoDB", details },
			{ status: 500 },
		);
	}
}

export async function GET() {
	return testMongoConnection();
}

export async function POST() {
	return testMongoConnection();
}
