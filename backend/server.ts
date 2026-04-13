import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { loginSchema } from "./types/index.js";

import "dotenv/config";

const app = express();
app.use(express.json());
const PORT = 3000;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:3000`);
});

app.get("/ping", (req, res) => {
	res.json({ message: "pong" });
});

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
		res.send(users);
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).json({
				message: err.message,
			});
		}
		res.status(500).send("Unknown error");
	}
});

// -- Login with email and password and compare loginCode --
app.post("/login", async (req, res) => {
	try {
		// Validate input
		const result = loginSchema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json({ error: result.error.message });
			return;
		}
		const { email, password } = result.data;

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		// Check if user exists
		if (!user) {
			return res
				.status(401)
				.json({ error: "Invalid credentials, user do not exist" });
		}

		// Compare loginCode
		if (user.loginCode !== password) {
			console.log(user.loginCode, password);
			return res
				.status(401)
				.json({ error: "Invalid credentials, wrong loginCode" });
		}

		// Success response
		return res.status(200).json({
			message: "Login successful",
			userId: user.id,
			name: user.firstName,
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

//Get availablity and empolyeeID
app.get("/availability/:employeeId", async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId)
    const availability = await prisma.availability.findMany({
      where: {userId: employeeId},
    })

    res.status(200).json(availability)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" })
  }
});

app.put("/availability/:employeeId", async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId)
    const {date, shift} = req.body;

    const availability = await prisma.availability.upsert({  //upsert är som if else, if (om where finns, updatera, annars skapa en)
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
    })
    res.status(200).json(availability)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" })
  }
})