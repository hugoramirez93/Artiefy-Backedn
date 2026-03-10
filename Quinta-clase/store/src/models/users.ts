import mongoose, { Schema, model, models } from "mongoose";
import { z } from "zod";

export interface IUser {
	username: string;
	email: string;
	password: string;
}

const userSchema = new Schema<IUser>({
	username: { type: String, required: true, unique: true },
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		match: [
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			"Por favor proporciona un correo electrónico válido",
		],
	},
	password: { type: String, required: true },
});

export default models.User || model<IUser>("User", userSchema);

export const userValidationSchema = z.object({
	username: z
		.string()
		.min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
	email: z
		.string()
		.email("El correo electrónico no es válido")
		.min(5, "El correo debe tener al menos 5 caracteres")
		.max(255, "El correo no puede exceder 255 caracteres"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
