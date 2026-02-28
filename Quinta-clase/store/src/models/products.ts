import mongoose,{ Schema, model, models } from "mongoose";

export interface IProduct {
	name: string;
	description: string;
	price: number;
	image: string;
	stock: number;
}

const ProductSchema = new Schema<IProduct>(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		image: { type: String, required: false },
		stock: { type: Number, required: true, default: 0 },
	},
	{ timestamps: true },
);

export default models.Product || model<IProduct>("Product", ProductSchema);
// export const Product = models.Product || model<IProduct>("Product", ProductSchema);
