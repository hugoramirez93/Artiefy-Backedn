import mongoose, { Schema, model, models } from "mongoose";
import { z } from "zod";

export interface IUser {
	username: string;
	email: string;
	password: string;
}

const userSchema = new Schema<IUser>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

export default models.User || model<IUser>("User", userSchema);

export const userValidationSchema = z.object({
	username: z
		.string()
		.min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
	email: z.string().email("El correo electrónico no es válido"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
