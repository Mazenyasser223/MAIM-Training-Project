import { Router } from "express";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import { auth, requireRole } from "../middleware/auth.js";
import { generateTicketQR } from "../utils/generateQR.js";

const router = Router();

router.post("/book", auth, async (req, res) => {
  try {
    const { eventId, seatNumber } = req.body;
    if (!eventId || !seatNumber) return res.status(400).json({ message: "eventId and seatNumber required" });
    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ message: "Event not found" });
    const seat = ev.seats.find(s => s.number === seatNumber);
    if (!seat) return res.status(400).json({ message: "Invalid seat" });
    if (seat.reserved) return res.status(409).json({ message: "Seat already booked" });

    const t = await Ticket.create({ user: req.user.id, event: ev._id, seatNumber });
    const qr = await generateTicketQR({ ticketId: t._id, eventId: ev._id, seatNumber, userId: req.user.id });
    t.qrCode = qr; await t.save();

    seat.reserved = true;
    seat.ticket = t._id;
    ev.popularity += 1;
    await ev.save();

    res.status(201).json(t);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/my", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).populate("event");
    res.json(tickets);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/checkin/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Ticket not found" });
    t.checkedIn = true; t.checkedInAt = new Date(); await t.save();
    res.json(t);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/notifications/upcoming", auth, async (req, res) => {
  try {
    const now = new Date();
    const next = new Date(now.getTime() + 7*24*60*60*1000);
    const tickets = await Ticket.find({ user: req.user.id }).populate("event");
    const upcoming = tickets.filter(t => t.event && new Date(t.event.date) >= now && new Date(t.event.date) <= next);
    res.json(upcoming);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
