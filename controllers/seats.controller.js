const Seat = require('../models/seat.model');
const mongoSanitize = require('mongo-sanitize');

const escape = (html) => {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) return res.status(404).send({ message: 'Not found...' });
    res.json(seat);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createSeat = async (req, res) => {
  try {
    const { day, seat, client, email } = req.body;
    if (!day || !seat || !client || !email) {
      return res.status(400).send({ message: 'Missing required fields: day, seat, client, email' });
    }

    const sanitizedData = {
      day: mongoSanitize(day),
      seat: mongoSanitize(seat),
      client: escape(mongoSanitize(client)),
      email: escape(mongoSanitize(email)),
    };

    const existing = await Seat.findOne({ day: sanitizedData.day, seat: sanitizedData.seat });
    if (existing) {
      return res.status(409).send({ message: "The slot is already taken..." });
    }

    const newSeat = new Seat(sanitizedData);
    const savedSeat = await newSeat.save();
    const allSeats = await Seat.find();
    req.io.emit('seatsUpdated', allSeats);
    res.status(201).json(savedSeat);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateSeat = async (req, res) => {
  try {
    const { day, seat: seatNumber, client, email } = req.body;
    if (!day || !seatNumber || !client || !email) {
      return res.status(400).send({ message: 'Missing required fields: day, seat, client, email' });
    }

    const sanitizedUpdate = {
      day: mongoSanitize(day),
      seat: mongoSanitize(seatNumber),
      client: escape(mongoSanitize(client)),
      email: escape(mongoSanitize(email)),
    };

    const updatedSeat = await Seat.findOneAndUpdate(
      { _id: req.params.id },
      { $set: sanitizedUpdate },
      { new: true }
    );

    if (!updatedSeat) return res.status(404).send({ message: 'Not found...' });

    const allSeats = await Seat.find();
    req.io.emit('seatsUpdated', allSeats);
    res.json(updatedSeat);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteSeat = async (req, res) => {
  try {
    const deletedSeat = await Seat.findByIdAndDelete(req.params.id);
    if (!deletedSeat) return res.status(404).send({ message: 'Not found...' });
    const allSeats = await Seat.find();
    req.io.emit('seatsUpdated', allSeats);
    res.json({ message: 'OK' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllSeats,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat
};
