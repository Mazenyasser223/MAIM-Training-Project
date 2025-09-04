import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  reserved: { type: Boolean, default: false },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  venue: String,
  price: { type: Number, default: 0 },
  totalSeats: { type: Number, default: 50 },
  seats: [seatSchema],
  status: { type: String, enum: ["upcoming","active","closed"], default: "upcoming" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  popularity: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
