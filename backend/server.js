import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import User from "./models/User.js";
import Patient from "./models/Patient.js";
import Ambulance from "./models/Ambulance.js";

const app = express();

/* =========================
   MIDDLEWARE
========================= */
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:8082",
      "http://localhost:3000",
    ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medicare";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

/* =========================
   REGISTER
========================= */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully ✅",
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =========================
   LOGIN
========================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Role validation
    if (role && user.role !== role) {
      return res.status(400).json({
        message: "Invalid role selected",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =========================
   PATIENT ROUTES
========================= */

/* ---- ADD PATIENT ---- */
app.post("/patients", async (req, res) => {
  try {
    const { name, age, disease, bed } = req.body;

    if (!name || !age || !disease || !bed) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newPatient = new Patient({
      name,
      age: Number(age),
      disease,
      bed,
      status: "Admitted",
    });

    await newPatient.save();

    res.status(201).json(newPatient);

  } catch (error) {
    console.error("Add Patient Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ---- GET ALL PATIENTS ---- */
app.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);

  } catch (error) {
    console.error("Fetch Patients Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ---- UPDATE PATIENT STATUS ---- */
app.put("/patients/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Admitted", "Discharged"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json(updatedPatient);

  } catch (error) {
    console.error("Update Patient Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ---- DELETE PATIENT ---- */
app.delete("/patients/:id", async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json({
      message: "Patient deleted successfully",
    });

  } catch (error) {
    console.error("Delete Patient Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =========================
   AMBULANCE LOCATION (SIMULATED POLLING)
========================= */
app.get("/ambulance-location", (req, res) => {
  const baseLat = 28.6139;
  const baseLng = 77.2090;
  const time = Date.now() / 5000;
  const lat = baseLat + 0.005 * Math.sin(time);
  const lng = baseLng + 0.005 * Math.cos(time);
  res.json({ lat, lng });
});

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Hospital Management Backend Running 🚀");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
