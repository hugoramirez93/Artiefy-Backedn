import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_FILES = /\.(.*)$/;

async function verifyToken(token: string) {
	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(process.env.JWT_SECRET || "clave secreta"),
		);

		return payload;
	} catch (error) {
		return null;
	}
}

export async function middleware(request: NextRequest) {
	// const token = request.cookies.get("token")?.value || "";
	const authHeader = request.headers.get("Authorization");

	// console.log("Middleware ejecutado para:", request.nextUrl.pathname);
	const isAuthRequiered =
		request.nextUrl.pathname.startsWith("/api/users") ||
		request.nextUrl.pathname.startsWith("/api/products");

	const isPublic =
		request.nextUrl.pathname.startsWith("/api/auth/login") ||
		request.nextUrl.pathname.startsWith("/api/auth/register") ||
		PUBLIC_FILES.test(request.nextUrl.pathname);

	if (!isAuthRequiered) {
		return NextResponse.json(
			{ message: "Acceso denegado: autenticación requerida" },
			{ status: 401 },
		);
	}

	if (!authHeader?.startsWith("Bearer ")) {
		return NextResponse.json(
			{ message: "Token no valido" },
			{
				status: 401,
			},
		);
	}
	console.log("Token recibido: ", authHeader);
	const token = authHeader.split(" ")[1];
	const validateToken = await verifyToken(token);

	// if (!token) {
	// 	return NextResponse.json(
	// 		{ message: "Token no valido" },
	// 		{
	// 			status: 401,
	// 		},
	// 	);
	// }

	if (!validateToken) {
		return NextResponse.json(
			{ message: "Token no valido" },
			{
				status: 401,
			},
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/api/users/:path*"],
};
