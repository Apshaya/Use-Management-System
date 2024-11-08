const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

/**
 * customer Routes
 */
router.get('/', customerController.homepage);

router.get('/add', customerController .addCustomer);
router.post('/add', customerController.postCustomer);
router.get('/view/:id', customerController.view);

router.get('/edit/:id', customerController.edit);
router.put('/edit/:id', customerController.editPost);




module.exports = router;
