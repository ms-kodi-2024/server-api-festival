const Testimonial = require('../models/testimonial.model');
const sanitizeHtml = require('sanitize-html');

const escape = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).send({ message: 'Not found...' });
    res.json(testimonial);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { author, text } = req.body;

    if (!author || !text) {
      return res.status(400).send({ message: 'Missing required fields: author, text' });
    }

    const sanitizedAuthor = escape(sanitizeHtml(author));
    const sanitizedText = escape(sanitizeHtml(text));

    const newTestimonial = new Testimonial({ author: sanitizedAuthor, text: sanitizedText });
    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { author, text } = req.body;

    if (!author || !text) {
      return res.status(400).send({ message: 'Missing required fields: author, text' });
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).send({ message: 'Not found...' });

    testimonial.author = escape(sanitizeHtml(author));
    testimonial.text = escape(sanitizeHtml(text));

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deletedTestimonial) return res.status(404).send({ message: 'Not found...' });
    res.json({ message: 'OK' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
