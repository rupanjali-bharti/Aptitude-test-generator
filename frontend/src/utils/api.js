import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

export const generateTests = (company, jobDescription, numberOfTests = 6) => {
  return apiClient.post('/tests/generate', {
    company,
    jobDescription,
    numberOfTests,
  });
};

export const getCompanyTests = (company) => {
  return apiClient.get(`/tests/${company}`);
};

export const submitTest = (testId, userId, answers) => {
  return apiClient.post('/tests/submit', {
    testId,
    userId,
    answers,
  });
};

export const getTestResult = (resultId) => {
  return apiClient.get(`/tests/result/${resultId}`);
};

export default apiClient;
