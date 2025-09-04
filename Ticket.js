import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  seatNumber: { type: Number, required: true },
  qrCode: String,
  bookedAt: { type: Date, default: Date.now },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: Date
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
