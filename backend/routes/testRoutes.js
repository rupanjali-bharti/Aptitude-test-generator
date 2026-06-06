const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

// Generate tests for a company
router.post('/generate', testController.generateTests);

// Get all tests for a company
router.get('/:company', testController.getCompanyTests);

// Submit test answers and get result
router.post('/submit', testController.submitTest);

// Get test result analysis
router.get('/result/:resultId', testController.getTestResult);

module.exports = router;
