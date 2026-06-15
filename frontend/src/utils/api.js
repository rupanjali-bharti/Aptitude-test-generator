import axios from 'axios';

// Ensure your backend URL is set in your .env file
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const generateTest = async (level, duration, questionCount = 10) => {
    try {
        const response = await axios.post(`${API_URL}/tests/generate`, { 
            level: level, 
            duration: duration,
            questionCount: questionCount
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};
// Add this to the bottom of src/utils/api.js
export const getCompanyTests = async () => {
    // Fetches predefined company-specific tests from the backend
    const response = await axios.get(`${API_URL}/tests/company`);
    return response.data;
};

export const submitTestResults = async (userId, testId, answers, score, timeTaken) => {
    // Pushes the final results to MongoDB for later viewing
    const response = await axios.post(`${API_URL}/tests/submit`, {
        userId,
        testId,
        answers,
        score,
        timeTaken
    });
    return response.data;
};