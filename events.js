import { Router } from "express";
import Event from "../models/Event.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const q = {};
    if (status) q.status = status;
    if (search) q.title = { $regex: search, $options: "i" };
    const events = await Event.find(q).sort({ date: 1 });
    res.json(events);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });
    res.json(ev);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const { title, description, date, venue, price, totalSeats, status } = req.body;
    if (!title || !date) return res.status(400).json({ message: "title & date required" });
    const seats = Array.from({ length: totalSeats || 50 }, (_, i) => ({ number: i+1, reserved: false }));
    const ev = await Event.create({ title, description, date, venue, price, totalSeats: totalSeats || 50, seats, status, createdBy: req.user.id });
    res.status(201).json(ev);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ev) return res.status(404).json({ message: "Event not found" });
    res.json(ev);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const ok = await Event.findByIdAndDelete(req.params.id);
    if (!ok) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
