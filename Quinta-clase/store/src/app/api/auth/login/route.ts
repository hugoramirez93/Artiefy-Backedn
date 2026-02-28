import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
		const token = jwt.sign(
			{ userId: usuario._id, email: usuario.email },
			JWT_SECRET,
			{ expiresIn: "1h" },
		);

		const res = NextResponse.json(
			{ token, message: "Login exitoso" },
			{ status: 200 },
		);
		res.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
      return res;
	} catch (error) {
		console.error("Error en el login:", error);
		return NextResponse.json(
			{ message: "Error en el servidor" },
			{ status: 500 },
		);
	}
}
