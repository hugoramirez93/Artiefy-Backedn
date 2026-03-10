import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User, { userValidationSchema } from "@/models/users";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
	await connectDB();
	try {
		const { username, email, password } = await request.json();

		// Validar con Zod
		const validation = userValidationSchema.safeParse({
			username,
			email,
			password,
		});

		if (!validation.success) {
			return NextResponse.json(
				{
					message: "Datos inválidos",
					errors: validation.error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				},
				{ status: 400 },
			);
		}

		const existe = await User.findOne({ email: validation.data.email });
		if (existe) {
			return NextResponse.json(
				{ message: "El correo ya está registrado" },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(validation.data.password, 10);
		const newUser = new User({
			username: validation.data.username,
			email: validation.data.email,
			password: hashedPassword,
		});

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
