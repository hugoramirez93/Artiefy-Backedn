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

export async function PUT(req: Request, context: any) {
  try {
    // 1️⃣ Obtener params (puede venir como Promise)
    const params = await Promise.resolve(context.params);
    const idParam = params?.id;

    if (!idParam) {
      return NextResponse.json(
        { error: "No llegó el parámetro id" },
        { status: 400 }
      );
    }

    const id = Number(String(idParam).trim());

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // 2️⃣ Leer body
    const body = await req.json();

    const name = body.name?.trim();
    const description = body.description?.trim();
    const price =
      body.price !== undefined ? Number(body.price) : undefined;

    // 3️⃣ Validar que haya algo para actualizar
    if (!name && !description && price === undefined) {
      return NextResponse.json(
        { error: "Debes enviar al menos un campo para actualizar" },
        { status: 400 }
      );
    }

    // 4️⃣ Verificar que el producto exista
    const exists = await prisma.product.findUnique({ where: { id } });

    if (!exists) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // 5️⃣ Actualizar
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
      },
    });

    // 6️⃣ Respuesta final
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Error interno en PUT", message },
      { status: 500 }
    );
  }
}

