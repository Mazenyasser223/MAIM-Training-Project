import dotenv from "dotenv"; dotenv.config();
import mongoose from "mongoose";
import connectDB from "../utils/db.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";

async function main() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Ticket.deleteMany({})]);

  const admin = await User.create({
    name: "Admin",
    email: "admin@eventx.com",
    password: "Admin123!",
    role: "admin",
    age: 30,
    gender: "other",
    interests: ["tech", "music"],
    location: "Cairo"
  });

  const user = await User.create({
    name: "User",
    email: "user@eventx.com",
    password: "User123!",
    role: "user",
    age: 24,
    gender: "male",
    interests: ["music", "sports"],
    location: "Giza"
  });

  const events = [
    { title: "Tech Summit 2025", description: "Annual tech conference.", date: new Date(Date.now()+10*86400000), venue: "Cairo Expo", price: 100, totalSeats: 60, status: "upcoming" },
    { title: "Live Jazz Night", description: "Enjoy smooth jazz.", date: new Date(Date.now()+3*86400000), venue: "Downtown Club", price: 50, totalSeats: 40, status: "upcoming" },
    { title: "Startup Mixer", description: "Meet founders & investors.", date: new Date(Date.now()-2*86400000), venue: "Hub Space", price: 0, totalSeats: 30, status: "closed" }
  ];

  for (const e of events) {
    const seats = Array.from({ length: e.totalSeats }, (_, i) => ({ number: i+1, reserved: false }));
    await Event.create({ ...e, seats, createdBy: admin._id });
  }

  console.log("Seeded: admin, user, events");
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
