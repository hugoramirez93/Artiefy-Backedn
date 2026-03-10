import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token: string) {
	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(process.env.JWT_SECRET || "clave secreta"),
		);
		return payload;
	} catch (error) {
		console.error("Error verificando token:", error);
		return null;
	}
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Rutas públicas que no requieren token
	const isPublic =
		pathname.startsWith("/api/auth/login") ||
		pathname.startsWith("/api/auth/register") ||
		/\.(.*)$/.test(pathname);

	// Rutas protegidas que requieren token
	const isProtected =
		pathname.startsWith("/api/users") || pathname.startsWith("/api/products");

	// Si es pública, permitir acceso
	if (isPublic) {
		return NextResponse.next();
	}

	// Si es protegida, validar token
	if (isProtected) {
		const authHeader = request.headers.get("Authorization");

		if (!authHeader?.startsWith("Bearer ")) {
			return NextResponse.json(
				{ message: "Token no válido o no proporcionado" },
				{ status: 401 },
			);
		}

		const token = authHeader.split(" ")[1];
		const payload = await verifyToken(token);

		if (!payload) {
			return NextResponse.json(
				{ message: "Token no válido o expirado" },
				{ status: 401 },
			);
		}

		// Agregar información del usuario al request
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("userId", payload.userId as string);
		requestHeaders.set("userEmail", payload.email as string);

		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/api/:path*"],
};
