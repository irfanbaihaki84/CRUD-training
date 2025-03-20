const express = require('express');
const shippingController = require('../controllers/shippingControllers');

const router = express.Router();

// CRUD Routes
router.post('/', shippingController.createPengiriman); // Create
router.get('/', shippingController.getAllPengiriman); // Read All
router.get('/:id', shippingController.getPengirimanById); // Read by ID
router.put('/:id', shippingController.updatePengiriman); // Update All Data
router.patch('/:id', shippingController.partialUpdatePengiriman); // Partial Update
router.delete('/:id', shippingController.deletePengiriman); // Delete

module.exports = router;
