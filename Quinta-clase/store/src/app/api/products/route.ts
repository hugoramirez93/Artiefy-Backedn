import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/products";

export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();
		const newProduct = await Product.create(body);
		return NextResponse.json(newProduct, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Error al crear el producto", details: error },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		await connectDB();
		const products = await Product.find();
		return NextResponse.json(products, { status: 200 });
	} catch (error) {
		console.error("Error al obtener productos de MongoDB", error);
		return NextResponse.json(
			{ message: "Error al obtener productos de MongoDB", details: error },
			{ status: 500 },
		);
	}
}
