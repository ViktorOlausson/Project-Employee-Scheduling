//import "express-session";
import { z } from "zod";

export type Role = "ADMIN" | "CHEF" | "WAITER" | "RUNNER" | "DISHWASHER";

/*
export interface SessionUser {
	id: string;
	role: Role;
	name: string;
}

--- Express types ---
declare module "express-session" {
	interface SessionData {
		user: SessionUser;
	}
}
*/

// --- Zod schemas ---
export const loginSchema = z.object({
	email: z.email("Invalid email address."),
	password: z.string().min(1, "Password is required."),
});

export const employeeRoleSchema = z.enum([
	"WAITER",
	"RUNNER",
	"DISHWASHER",
	"CHEF",
]);

export const createEmployeeSchema = z.object({
	firstName: z.string().min(1, "First name is required."),
	lastName: z.string().min(1, "Last name is required."),
	email: z.email("Invalid email address."),
	code: z.string().min(1, "Code is required."),
	/*.regex(
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/,
			"Måste innehålla minst en versal, en gemen och en siffra.",
		),
        */
	role: employeeRoleSchema,
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

// --- Derived types ---
export type LoginBody = z.infer<typeof loginSchema>;
export type CreateEmployeeBody = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeBody = z.infer<typeof updateEmployeeSchema>;
export type EmployeeRole = z.infer<typeof employeeRoleSchema>;

export interface EmployeeRecord {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: EmployeeRole;
	createdAt: Date;
}
