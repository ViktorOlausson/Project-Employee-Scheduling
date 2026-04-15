import { z } from "zod";

// --- Zod schemas ---
export const loginSchema = z.object({
	email: z.email("Invalid email address."),
	password: z.string().min(1, "Password is required."),
});

const RoleSchema = z.enum(["EMPLOYEE", "EMPLOYER"]);

const OccupationSchema = z.enum(["RUNNER", "WAITER", "DISHWASHER", "CHEF"]);

export const userSchema = z.object({
	email: z.email("Invalid email"),
	firstName: z
		.string()
		.min(2, { message: "first name must contain at least 2 characters" }),
	lastName: z
		.string()
		.min(2, { message: "last name must contain at least 2 characters" }),
	Occupation: OccupationSchema,
	role: RoleSchema,
	password: z
		.string()
		.min(7, { message: "password must contain atleast 7 characters" })
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least one special character",
		),
});
