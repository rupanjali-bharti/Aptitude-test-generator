const testService = require('../services/testService');

class TestController {
  async generateTests(req, res) {
    try {
      const { company, jobDescription, numberOfTests = 6 } = req.body;

      if (!company || !jobDescription) {
        return res.status(400).json({
          success: false,
          message: 'Company name and job description are required',
        });
      }

      const tests = await testService.generateTestsForCompany(
        company,
        jobDescription,
        numberOfTests
      );

      res.status(201).json({
        success: true,
        data: tests,
        message: `Generated ${tests.length} tests for ${company}`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating tests',
        error: error.message,
      });
    }
  }

  async getCompanyTests(req, res) {
    try {
      const { company } = req.params;

      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Company name is required',
        });
      }

      const tests = await testService.getTestsForCompany(company);

      res.status(200).json({
        success: true,
        data: tests,
        count: tests.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching tests',
        error: error.message,
      });
    }
  }

  async submitTest(req, res) {
    try {
      const { testId, userId, answers } = req.body;

      if (!testId || !userId || !answers) {
        return res.status(400).json({
          success: false,
          message: 'Test ID, User ID, and answers are required',
        });
      }

      const result = await testService.submitTestResult(testId, userId, answers);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Test submitted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error submitting test',
        error: error.message,
      });
    }
  }

  async getTestResult(req, res) {
    try {
      const { resultId } = req.params;

      if (!resultId) {
        return res.status(400).json({
          success: false,
          message: 'Result ID is required',
        });
      }

      const result = await testService.getTestResult(resultId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Test result not found',
        });
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching test result',
        error: error.message,
      });
    }
  }
}

module.exports = new TestController();
