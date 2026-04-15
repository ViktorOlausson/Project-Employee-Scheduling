import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const adminEmail = process.env.DOCKER_ADMIN_EMAIL ?? "admin@docker.local";
const adminPassword = process.env.DOCKER_ADMIN_PASSWORD ?? "Admin123!";

async function main() {
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    console.log("Docker seed skipped: users already exist.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: adminPassword,
      loginCode: hashedPassword,
      role: "EMPLOYER",
      Occupation: "CHEF",
      firstName: "Docker",
      lastName: "Admin",
    },
  });

  console.log(`Docker admin user created: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error("Docker seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
