import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID del producto no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const productoEliminado = await prisma.producto.delete({
      where: {
        id: parseInt(id), // Asegúrate de que el ID sea un número si tu base de datos lo espera así
      },
    });
    return NextResponse.json(
      { message: "Producto eliminado exitosamente", producto: productoEliminado },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'P2025') { // Código de error de Prisma para "registro no encontrado"
      return NextResponse.json(
        { error: `Producto con ID ${id} no encontrado` },
        { status: 404 }
      );
    }
    console.error("Error al eliminar el producto:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al eliminar el producto" },
      { status: 500 }
    );
  }
}