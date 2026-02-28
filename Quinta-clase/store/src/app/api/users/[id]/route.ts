import { NextResponse } from "next/server";
import { userController } from "@/lib/controller/userController";
import { validateProductData } from "../../validacion/validator";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const result = await userController.getUserById(id);
	return validateProductData(result);
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await request.json();
	const result = await userController.updateUser(id, body);

	return validateProductData(result);
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const result = await userController.deleteUser(id);

	return validateProductData(result);
}
