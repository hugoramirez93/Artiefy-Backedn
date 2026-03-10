import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import User from "@/models/users";

const JWT_SECRET = process.env.JWT_SECRET || "clave secreta";

export async function POST(request: Request) {
	try {
		await connectDB();
		const { email, password } = await request.json();
		const usuario = await User.findOne({ email });
		if (!usuario) {
			return NextResponse.json({ message: "Correo invalido" }, { status: 401 });
		}
		const isPasswordValid = await bcrypt.compare(password, usuario.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: "Contraseña invalida" },
				{ status: 401 },
			);
		}

		// Generar token con jose
		const token = await new SignJWT({
			userId: usuario._id.toString(),
			email: usuario.email,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1h")
			.sign(new TextEncoder().encode(JWT_SECRET));

		return NextResponse.json(
			{ token, message: "Login exitoso", user: { email: usuario.email } },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error en el login:", error);
		return NextResponse.json(
			{ message: "Error en el servidor" },
			{ status: 500 },
		);
	}
}