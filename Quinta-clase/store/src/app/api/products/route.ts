import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product, { productValidationSchema } from "@/models/products";

export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();

		// Validar datos con Zod
		const validation = productValidationSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{
					message: "Datos de producto inválidos",
					errors: validation.error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				},
				{ status: 400 },
			);
		}

		const newProduct = await Product.create(validation.data);
		return NextResponse.json(
			{ message: "Producto creado exitosamente", product: newProduct },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error al crear el producto:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return NextResponse.json(
			{ message: "Error al crear el producto", details: errorMessage },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		await connectDB();
		const products = await Product.find().sort({ createdAt: -1 });
		return NextResponse.json(
			{ message: "Productos obtenidos exitosamente", products },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error al obtener productos:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return NextResponse.json(
			{ message: "Error al obtener productos", details: errorMessage },
			{ status: 500 },
		);
	}
}
