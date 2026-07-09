import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ["Admin", "Doctor", "Nurse", "Receptionist"] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const seedUsers = [
  { name: "Admin User",       email: "admin@medicare.com",        password: "password123", role: "Admin" },
  { name: "Dr. John Smith",   email: "doctor@medicare.com",       password: "password123", role: "Doctor" },
  { name: "Nurse Sarah Lee",  email: "nurse@medicare.com",        password: "password123", role: "Nurse" },
  { name: "Reception Desk",   email: "reception@medicare.com",    password: "password123", role: "Receptionist" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    for (const u of seedUsers) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`⚠️  Already exists: ${u.email}`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`✅ Created: ${u.role} → ${u.email}`);
    }

    console.log("\n🎉 Seed complete! You can now login with:");
    console.log("   Admin:       admin@medicare.com       / password123");
    console.log("   Doctor:      doctor@medicare.com      / password123");
    console.log("   Nurse:       nurse@medicare.com       / password123");
    console.log("   Receptionist: reception@medicare.com / password123");

  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
