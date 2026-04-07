import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Seeding database with Lord of the Rings data...");

	// Skapa Gandalf som EMPLOYER
	const gandalf = await prisma.user.upsert({
		where: { email: "gandalf@middleearth.com" },
		update: {},
		create: {
			email: "gandalf@middleearth.com",
			password: "$2b$10$epgDo3.ebUWtQc.5q.1234567890abcdefg",
			role: "EMPLOYER",
		},
	});

	console.log(`✅ Employer created: ${gandalf.email}`);

	// Skapa employees direkt i users-tabellen
	const employees = [
		{ firstName: "Frodo", lastName: "Baggins", loginCode: "FRODO9" },
		{ firstName: "Sam", lastName: "Gamgee", loginCode: "SAM123" },
		{ firstName: "Legolas", lastName: "Greenleaf", loginCode: "ELF42" },
		{ firstName: "Gimli", lastName: "Son of Gloin", loginCode: "DWARF1" },
		{
			firstName: "Aragorn",
			lastName: "Son of Arathorn",
			loginCode: "KING1",
		},
		{ firstName: "Boromir", lastName: "of Gondor", loginCode: "GONDOR7" },
		{ firstName: "Merry", lastName: "Brandybuck", loginCode: "H0BB1T" },
		{ firstName: "Pippin", lastName: "Took", loginCode: "TOOK12" },
	];

	for (const emp of employees) {
		await prisma.user.upsert({
			where: { email: `${emp.firstName.toLowerCase()}@shire.net` },
			update: {
				firstName: emp.firstName,
				lastName: emp.lastName,
				loginCode: emp.loginCode,
			},
			create: {
				email: `${emp.firstName.toLowerCase()}@shire.net`,
				password: "$2b$10$epgDo3.ebUWtQc.5q.1234567890abcdefg",
				role: "EMPLOYEE",
				firstName: emp.firstName,
				lastName: emp.lastName,
				loginCode: emp.loginCode,
			},
		});
	}

	console.log("✅ Seed completed!");
}

main()
	.catch((e) => {
		console.error("❌ Seed failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
