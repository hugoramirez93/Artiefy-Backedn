import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(_req: Request, context: any) {
  try {
    // ✅ soporta params como objeto o como Promise
    const params = await Promise.resolve(context.params);
    const idParam = params?.id;

    if (!idParam) {
      return NextResponse.json(
        { error: "No llegó el parámetro id", params },
        { status: 400 }
      );
    }

    const rawId = String(idParam).trim().replace(/\/+$/, "");
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido", idParam, rawId },
        { status: 400 }
      );
    }

    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ ok: true, deletedId: id }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Fallo interno en DELETE", message },
      { status: 500 }
    );
  }
}
