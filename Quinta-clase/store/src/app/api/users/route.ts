import { NextResponse } from "next/server";
import { userController } from "@/lib/controller/userController";
import { validateProductData } from "../validacion/validator";

export async function POST(request: Request) {
	const body = await request.json();
	const result = await userController.createUser(body);
	return validateProductData(result);
}

export async function GET() {
	const result = await userController.getAllUsers();
	return validateProductData(result);
}
