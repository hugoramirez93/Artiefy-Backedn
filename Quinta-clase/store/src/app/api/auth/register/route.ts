import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import users from "@/models/users";
import bcrypt from "bcryptjs";
import { validateProductData } from "../../validacion/validator";

export async function POST(request: NextRequest) {
	await connectDB();
	try {
		const { username, email, password } = await request.json();
		const existe = await users.findOne({ email });
		if (existe) {
			return NextResponse.json(
				{ message: "El correo ya está registrado" },
				{ status: 400 },
			);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new users({
			username,
			email,
			password: hashedPassword,
		});
		const isvalid = validateProductData(newUser);
		if (!isvalid) {
			return NextResponse.json(
				{ message: "Datos de usuario no válidos" },
				{ status: 400 },
			);
		}
		await newUser.save();
		return NextResponse.json(
			{ message: "Usuario registrado exitosamente" },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error al registrar usuario:", error);
		return NextResponse.json(
			{ message: "Error al registrar usuario" },
			{ status: 500 },
		);
	}
}
