import { NextResponse } from "next/server";

export function validateProductData(data: any) {
	try {
		if (!data.success) {
			return NextResponse.json(
				{ error: data.error, details: data.details },
				{ status: 400 },
			);
		}

		return NextResponse.json( data.data ,  { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				error: "Error al validar los datos del producto.",
				details: error instanceof Error ? error.message : error,
			},
			{ status: 500 },
		);
	}
}
