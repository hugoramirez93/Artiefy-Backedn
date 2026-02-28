import { connectDB } from "@/lib/mongoose";
import User, { userValidationSchema } from "@/models/users";
import { validateZodUser } from "@/app/api/validacion/validatorUserZod";

export const userController = {
	// Crear un nuevo usuario
	async createUser(userData: {
		username: string;
		email: string;
		password: string;
	}) {
		try {
			const validation = userValidationSchema.safeParse(userData);
			if (!validation.success) {
				return {
					success: false,
					error: "Datos de usuario inválidos",
					details: validation.error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				};
			}
			await connectDB();
			const newUser = await User.create(validation.data);
			return { success: true, data: newUser };
		} catch (error) {
			return {
				success: false,
				error: "Error al crear el usuario",
				details: error instanceof Error ? error.message : error,
			};
		}
	},
	// Obtener todos los usuarios
	async getAllUsers() {
		try {
			await connectDB();
			const users = await User.find();
			return { success: true, data: users };
		} catch (error) {
			return {
				success: false,
				error: "Error al obtener los usuarios",
				details: error instanceof Error ? error.message : error,
			};
		}
	},

	// Obtener un usuario por ID
	async getUserById(id: string) {
		try {
			await connectDB();
			const user = await User.findById(id);
			if (!user) {
				return { success: false, error: "Usuario no encontrado" };
			}
			return { success: true, data: user };
		} catch (error) {
			return {
				success: false,
				error: "Error al obtener el usuario",
				details: error instanceof Error ? error.message : error,
			};
		}
	},

	// Actualizar un usuario
	async updateUser(
		id: string,
		userData: Partial<{ username: string; email: string; password: string }>,
	) {
		try {
			await connectDB();
			const updatedUser = await User.findByIdAndUpdate(id, userData, {
				new: true,
				runValidators: true,
			});
			if (!updatedUser) {
				return { success: false, error: "Usuario no encontrado" };
			}
			return { success: true, data: updatedUser };
		} catch (error) {
			return {
				success: false,
				error: "Error al actualizar el usuario",
				details: error instanceof Error ? error.message : error,
			};
		}
	},

	// Eliminar un usuario
	async deleteUser(id: string) {
		try {
			await connectDB();
			const deletedUser = await User.findByIdAndDelete(id);
			if (!deletedUser) {
				return { success: false, error: "Usuario no encontrado" };
			}
			return { success: true, data: deletedUser };
		} catch (error) {
			return {
				success: false,
				error: "Error al eliminar el usuario",
				details: error instanceof Error ? error.message : error,
			};
		}
	},
};
