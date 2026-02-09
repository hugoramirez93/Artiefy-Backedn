import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
	_req: Request,
	{ params }: { params: { id: string } },
) {
	const id = Number(params.id);

	if (Number.isNaN(id)) {
		return NextResponse.json({ error: "ID inválido." }, { status: 400 });
	}

	const exists = await prisma.product.findUnique({ where: { id } });
	if (!exists) {
		return NextResponse.json(
			{ error: "Producto no encontrado." },
			{ status: 404 },
		);
	}

	await prisma.product.delete({ where: { id } });

	return NextResponse.json({ ok: true, deletedId: id }, { status: 200 });
}
