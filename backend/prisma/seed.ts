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
    update: {
      Occupation: "CHEF",
    },
    create: {
      email: "gandalf@middleearth.com",
      password: "$2b$10$epgDo3.ebUWtQc.5q.1234567890abcdefg",
      role: "EMPLOYER",
      Occupation: "CHEF",
    },
  });

  console.log(`✅ Employer created: ${gandalf.email}`);

  // Skapa employees direkt i users-tabellen
  const employees: {
    firstName: string;
    lastName: string;
    loginCode: string;
    Occupation: "RUNNER" | "WAITER" | "DISHWASHER" | "CHEF";
  }[] = [
    {
      firstName: "Frodo",
      lastName: "Baggins",
      loginCode: "FRODO9",
      Occupation: "RUNNER",
    },
    {
      firstName: "Sam",
      lastName: "Gamgee",
      loginCode: "SAM123",
      Occupation: "WAITER",
    },
    {
      firstName: "Legolas",
      lastName: "Greenleaf",
      loginCode: "ELF42",
      Occupation: "RUNNER",
    },
    {
      firstName: "Gimli",
      lastName: "Son of Gloin",
      loginCode: "DWARF1",
      Occupation: "DISHWASHER",
    },
    {
      firstName: "Aragorn",
      lastName: "Son of Arathorn",
      loginCode: "KING1",
      Occupation: "CHEF",
    },
    {
      firstName: "Boromir",
      lastName: "of Gondor",
      loginCode: "GONDOR7",
      Occupation: "WAITER",
    },
    {
      firstName: "Merry",
      lastName: "Brandybuck",
      loginCode: "H0BB1T",
      Occupation: "DISHWASHER",
    },
    {
      firstName: "Pippin",
      lastName: "Took",
      loginCode: "TOOK12",
      Occupation: "RUNNER",
    },
  ];

  for (const emp of employees) {
    await prisma.user.upsert({
      where: { email: `${emp.firstName.toLowerCase()}@shire.net` },
      update: {
        firstName: emp.firstName,
        lastName: emp.lastName,
        loginCode: emp.loginCode,
        Occupation: emp.Occupation,
      },
      create: {
        email: `${emp.firstName.toLowerCase()}@shire.net`,
        password: "$2b$10$epgDo3.ebUWtQc.5q.1234567890abcdefg",
        role: "EMPLOYEE",
        Occupation: emp.Occupation,
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
