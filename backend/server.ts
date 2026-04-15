import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { loginSchema } from "./types/index.js";
import "dotenv/config";
import logger from "./logger.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

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
    logger.info("trying to login");
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      logger.error(`failed login attempt: ${result.error}`);
      return res.status(400).json({ error: result.error.message });
    }

    const { email, password } = result.data;
    logger.info(`trying to login to: ${result.data.email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.error(`user not found`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Använd bcrypt.compare – aldrig klartextjämförelse
    const isMatch = await bcrypt.compare(password, user.loginCode ?? "");
    if (!isMatch) {
      logger.error(`in valid credentials`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Kontrollera att JWT_SECRET finns
    if (!process.env.JWT_SECRET) {
      logger.error(`JWT_SECRET is not defined`);
      throw new Error("JWT_SECRET is not defined");
    }

    // Skapa JWT med token och role (frontend förväntar sig detta)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Returnera token och role – till frontend
    logger.info(`login successful: ${user.email} role: ${user.role}`);
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
    logger.info("fetch all employees");
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

app.get("/availability", async (req, res) => {
  try {
    const availability = await prisma.availability.findMany();
    logger.info("fetch all availability");
    res.status(200).json(availability);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -- Get availablity and empolyeeID --
app.get("/availability/:employeeId", async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    const availability = await prisma.availability.findMany({
      where: { userId: employeeId },
    });

    logger.info(`get availability for: ${employeeId}`);
    res.status(200).json(availability);
  } catch (error) {
    logger.error(error);
    // console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -- Update availability --
// -- Update availability --
app.put("/availability/:employeeId", async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    const { entries } = req.body;

    await prisma.availability.deleteMany({
      where: { userId: employeeId },
    });

    if (entries && entries.length > 0) {
      await prisma.availability.createMany({
        data: entries.map((entry: { date: string; shift: string }) => ({
          userId: employeeId,
          date: new Date(entry.date),
          shift: entry.shift,
        })),
      });
    }

    logger.info(`updated availability for: ${employeeId}`);
    res.status(200).json({ message: "Availability updated" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/availability/:availabilityId", async (req, res) => {
  try {
    const availabilityId = parseInt(req.params.availabilityId);

    if (Number.isNaN(availabilityId)) {
      return res.status(400).json({ message: "invalid availability id" });
    }

    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
      select: { id: true },
    });

    if (!availability) {
      return res.status(400).json({ message: "availability id not found" });
    }

    const deleted = await prisma.availability.delete({
      where: { id: availabilityId },
    });

    return res.status(200).json(deleted);
  } catch (err) {
    if (err instanceof Error) {
      logger.error("failed to delete availability", err);
      return res
        .status(500)
        .json({ error: `Internal server error: ${err.message}` });
    }
    logger.error("unknown error", err);
    return res.status(500).json({ error: `unknown error: ${err}` });
  }
});

const RoleSchema = z.enum(["EMPLOYEE", "EMPLOYER"]);
const OccupationSchema = z.enum(["RUNNER", "WAITER", "DISHWASHER", "CHEF"]);

const userSchema = z.object({
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
// -- Create test user -- OBS! rensa efter test
app.post("/users", async (req, res) => {
  try {
    const dataBody = await req.body;
    const validUser = userSchema.safeParse(dataBody);
    if (!validUser.success) {
      logger.error("not a valid user", validUser.error);
      return res.status(400).json({ error: validUser.error.message });
    }
    const { email, firstName, lastName, Occupation, role, password } =
      validUser.data;
    const user = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        Occupation: Occupation,
        role: role,
        password: password,
        loginCode: await bcrypt.hash(password, 10),
      },
    });
    logger.info(`created new user: ${user}`);
    res.status(201).json({
      message: "User Created",
      user: user,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Kunde inte skapa användare" });
  }
});

// -- Get schedule --
app.get("/schedule", async (req, res) => {
  try {
    const schedule = await prisma.scheduleEntry.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            Occupation: true,
          },
        },
      },
    });
    logger.info("fetch schedule");
    res.status(200).json(schedule);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -- Update schedule --
app.put("/schedule", async (req, res) => {
  try {
    const { userId, date, shift } = req.body;

    const entry = await prisma.scheduleEntry.upsert({
      where: {
        userId_date_shift: {
          userId: userId,
          date: new Date(date),
          shift: shift,
        },
      },
      update: {},
      create: {
        userId: userId,
        date: new Date(date),
        shift: shift,
      },
    });

    logger.info(`updated schedule for userId: ${userId}`);
    res.status(200).json(entry);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/schedule", async (req, res) => {
  try {
    const { userId, date, shift } = req.body;

    await prisma.scheduleEntry.deleteMany({
      where: {
        userId: userId,
        date: new Date(date),
        shift: shift,
      },
    });

    logger.info(`deleted schedule for userId: ${userId}`);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/schedule/:id", async (req, res) => {
  try {
    logger.info("trying to fetch user schedule");
    const userId = parseInt(req.params.id);
    const schedule = await prisma.scheduleEntry.findMany({
      where: { userId: userId },
    });
    if (schedule.length === 0) {
      return res.status(404).json({ message: "unable to find schedule" });
    }
    return res.status(200).json(schedule);
  } catch (err) {
    if (err instanceof Error) {
      logger.error("failed to fetch schedule for user", err);
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
    logger.error("unknown error", err);
    res.status(500).json({ error: `unknown error: ${err}` });
  }
});
