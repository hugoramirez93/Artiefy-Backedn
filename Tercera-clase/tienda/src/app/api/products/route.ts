import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
	const products = await prisma.product.findMany();
	return NextResponse.json(products);
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const name = String(body?.name ?? "").trim();
		const description = String(body?.description ?? "").trim();
		const price = Number(body?.price);

		if (!name || !description || Number.isNaN(price)) {
			return NextResponse.json(
				{ error: "name, description y price son obligatorios." },
				{ status: 400 },
			);
		}

		const created = await prisma.product.create({
			data: { name, description, price },
		});

		return NextResponse.json(created, { status: 201 });
	} catch {
		return NextResponse.json(
			{ error: "JSON inválido o error creando producto." },
			{ status: 400 },
		);
	}
}
