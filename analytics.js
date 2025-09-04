import { Router } from "express";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/summary", auth, requireRole("admin"), async (req, res) => {
  try {
    const [eventsCount, tickets, events] = await Promise.all([
      Event.countDocuments(),
      Ticket.find().populate("event"),
      Event.find()
    ]);
    const revenue = tickets.reduce((s, t) => s + (t.event?.price || 0), 0);
    const ticketsSold = tickets.length;
    const attendees = new Set(tickets.map(t => String(t.user))).size;
    res.json({ eventsCount, ticketsSold, revenue, attendees });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/demographics", auth, requireRole("admin"), async (req, res) => {
  try {
    const tickets = await Ticket.find();
    const userIds = [...new Set(tickets.map(t => String(t.user)))];
    const users = await User.find({ _id: { $in: userIds } });

    const ageGroups = { "0-17": 0, "18-24": 0, "25-34": 0, "35-44": 0, "45+": 0 };
    const gender = { male: 0, female: 0, other: 0 };
    const interests = {};
    const locations = {};

    for (const u of users) {
      const a = u.age ?? 0;
      if (a <= 17) ageGroups["0-17"]++;
      else if (a <= 24) ageGroups["18-24"]++;
      else if (a <= 34) ageGroups["25-34"]++;
      else if (a <= 44) ageGroups["35-44"]++;
      else ageGroups["45+"]++;

      gender[u.gender || "other"] = (gender[u.gender || "other"] || 0) + 1;

      (u.interests || []).forEach(i => interests[i] = (interests[i] || 0) + 1);
      if (u.location) locations[u.location] = (locations[u.location] || 0) + 1;
    }

    res.json({ ageGroups, gender, interests, locations });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
