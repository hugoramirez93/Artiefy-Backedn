import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const productos = await prisma.producto.findMany();
  return NextResponse.json(productos);
}

export async function POST(request: Request) {
  const { nombre, descripcion, precio, stock } = await request.json();

  if (!nombre || !descripcion || !precio || stock === null) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios" },
      { status: 400 }
    );
  }

  try {
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio,
        stock,
      },
    });
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },{ status: 500 }
    );
  }
}