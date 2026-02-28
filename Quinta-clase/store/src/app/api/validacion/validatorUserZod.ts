import { userValidationSchema } from "@/models/users";

export function validateZodUser(userData: any) {
	try {
		const validation = userValidationSchema.safeParse(userData);
		if (!validation.success) {
			return {
				success: false,
				error: "Datos de usuario no válidos",
				details: validation.error.issues.map((err) => ({
					field: err.path.join("."),
					message: err.message,
				})),
			};
		}
		return { success: true, data: validation.data };
	} catch (error) {
		return {
			success: false,
			error: "Error al validar los datos del usuario",
			details: error instanceof Error ? error.message : error,
		};
	}
}
