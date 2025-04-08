const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonials.controller');

router.get('/', testimonialsController.getAllTestimonials);
router.get('/:id', testimonialsController.getTestimonialById);
router.post('/', testimonialsController.createTestimonial);
router.put('/:id', testimonialsController.updateTestimonial);
router.delete('/:id', testimonialsController.deleteTestimonial);

module.exports = router;
