import mongoose, { Schema, model, models } from "mongoose";
import { z } from "zod";

export interface IProduct {
	name: string;
	description: string;
	price: number;
	image?: string;
	stock: number;
}

const ProductSchema = new Schema<IProduct>(
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 100,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			minlength: 10,
			maxlength: 1000,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			min: [0, "El precio no puede ser negativo"],
		},
		image: {
			type: String,
			required: false,
		},
		stock: {
			type: Number,
			required: true,
			default: 0,
			min: [0, "El stock no puede ser negativo"],
		},
	},
	{ timestamps: true },
);

export default models.Product || model<IProduct>("Product", ProductSchema);

export const productValidationSchema = z.object({
	name: z
		.string()
		.min(3, "El nombre debe tener al menos 3 caracteres")
		.max(100, "El nombre no puede exceder 100 caracteres"),
	description: z
		.string()
		.min(10, "La descripción debe tener al menos 10 caracteres")
		.max(1000, "La descripción no puede exceder 1000 caracteres"),
	price: z
		.number()
		.positive("El precio debe ser mayor a 0")
		.finite("El precio debe ser un número válido"),
	image: z.string().url("La imagen debe ser una URL válida").optional(),
	stock: z
		.number()
		.int("El stock debe ser un número entero")
		.nonnegative("El stock no puede ser negativo"),
});
