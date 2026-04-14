import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { loginSchema } from "./types/index.js";
import "dotenv/config";
import logger from "./logger.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const corsOptions = {
	origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

const PORT = 3000;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	logger.error("DATABASE_URL is not set");
	throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`);
	console.log(`Server is running on http://localhost:${PORT}`);
});

// -- Login --
app.post("/auth/login", async (req, res) => {
	try {
		const result = loginSchema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({ error: result.error.message });
		}

		const { email, password } = result.data;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Använd bcrypt.compare – aldrig klartextjämförelse
		const isMatch = await bcrypt.compare(password, user.loginCode ?? "");
		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Kontrollera att JWT_SECRET finns
		if (!process.env.JWT_SECRET) {
			throw new Error("JWT_SECRET is not defined");
		}

		// Skapa JWT med token och role (frontend förväntar sig detta)
		const token = jwt.sign(
			{ userId: user.id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" },
		);

		// Returnera token och role – till frontend
		return res.status(200).json({ token, role: user.role });
	} catch (error) {
		logger.error(`Login error: ${error}`);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// -- Get all employees --
app.get("/users/employees/all", async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			where: { role: "EMPLOYEE" },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				Occupation: true,
				role: true,
			},
		});
		logger.info("fetch all users");
		res.send(users);
	} catch (err) {
		if (err instanceof Error) {
			logger.error(err);
			res.status(500).json({
				message: err.message,
			});
		}
		res.status(500).send("Unknown error");
	}
});

// -- Get availablity and empolyeeID --
app.get("/availability/:employeeId", async (req, res) => {
	try {
		const employeeId = parseInt(req.params.employeeId);
		const availability = await prisma.availability.findMany({
			where: { userId: employeeId },
		});

		res.status(200).json(availability);
	} catch (error) {
		logger.error(error);
		// console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// -- Update availability --
app.put("/availability/:employeeId", async (req, res) => {
	try {
		const employeeId = parseInt(req.params.employeeId);
		const { date, shift } = req.body;

		const availability = await prisma.availability.upsert({
			//upsert är som if else, if (om where finns, updatera, annars skapa en)
			where: {
				userId_date_shift: {
					userId: employeeId,
					date: new Date(date),
					shift: shift,
				},
			},
			update: {},
			create: {
				userId: employeeId,
				date: new Date(date),
				shift: shift,
			},
		});
		res.status(200).json(availability);
	} catch (error) {
		logger.error(error);
		// console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// -- Create test user -- OBS! rensa efter test
app.post("/create-test-user", async (req, res) => {
	try {
		const user = await prisma.user.create({
			data: {
				email: "test2@example.com",
				firstName: "Test2",
				lastName: "User2",
				password: "123456",
				loginCode: await bcrypt.hash("123456", 10),
			},
		});
		res.status(201).json({
			message: "Testanvändare skapad",
			userId: user.id,
		});
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: "Kunde inte skapa användare" });
	}
});
