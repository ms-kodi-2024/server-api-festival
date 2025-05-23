const Concert = require('../models/concert.model');
const sanitizeHtml = require('sanitize-html');

const validateConcertData = (data) => {
  const { performer, genre, price, day, image } = data;

  if (!performer || !genre || !price || !day || !image) {
    return 'Missing required fields';
  }

  if (typeof performer !== 'string' || typeof genre !== 'string' || typeof image !== 'string') {
    return 'Performer, genre, and image must be strings';
  }

  if (isNaN(price) || price < 0) {
    return 'Price must be a positive number';
  }

  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return 'Day must be an integer between 1 and 31';
  }

  return null; // all good
};

const sanitizeConcertData = (data) => ({
  performer: sanitizeHtml(data.performer),
  genre: sanitizeHtml(data.genre),
  price: Number(data.price), // sanitized and casted to number
  day: Number(data.day),     // sanitized and casted to number
  image: sanitizeHtml(data.image),
});

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.json(concerts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getConcertById = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) return res.status(404).send({ message: 'Not found...' });
    res.json(concert);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createConcert = async (req, res) => {
  try {
    const validationError = validateConcertData(req.body);
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const sanitizedData = sanitizeConcertData(req.body);
    const newConcert = new Concert(sanitizedData);
    const savedConcert = await newConcert.save();
    res.status(201).json(savedConcert);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateConcert = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) return res.status(404).send({ message: 'Not found...' });

    const validationError = validateConcertData(req.body);
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const sanitizedData = sanitizeConcertData(req.body);

    concert.performer = sanitizedData.performer;
    concert.genre = sanitizedData.genre;
    concert.price = sanitizedData.price;
    concert.day = sanitizedData.day;
    concert.image = sanitizedData.image;

    const updatedConcert = await concert.save();
    res.json(updatedConcert);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteConcert = async (req, res) => {
  try {
    const deletedConcert = await Concert.findByIdAndDelete(req.params.id);
    if (!deletedConcert) return res.status(404).send({ message: 'Not found...' });
    res.json({ message: 'OK' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllConcerts,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert,
};
