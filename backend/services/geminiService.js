const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

class GeminiService {
  async generateTestQuestions(company, jobDescription, numberOfQuestions = 15) {
    try {
      const prompt = `
You are an expert aptitude test creator. Generate ${numberOfQuestions} multiple choice questions for an aptitude test for a ${company} ${jobDescription} position.

Requirements:
1. Create questions similar to online assessment standards (indiabix level)
2. Mix topics: Quantitative Aptitude, Logical Reasoning, Verbal Ability
3. Include easy, medium, and hard difficulty levels
4. Each question should have 4 options (A, B, C, D)
5. Return ONLY valid JSON without markdown or code blocks

Response format (MUST be valid JSON):
{
  "questions": [
    {
      "text": "question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "topic": "Quantitative Aptitude",
      "difficulty": "medium",
      "explanation": "Explanation of the answer"
    }
  ]
}

Generate the questions now:`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean up response - remove markdown formatting if present
      let cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsedResponse = JSON.parse(cleanedText);
      return parsedResponse.questions;
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      throw new Error('Failed to generate questions using Gemini API');
    }
  }

  async analyzeTestResults(testData, topicPerformance) {
    try {
      const prompt = `
Analyze the following aptitude test performance and provide insights:

Test Results:
- Score: ${testData.score}/${testData.totalQuestions}
- Accuracy: ${testData.accuracy.toFixed(2)}%
- Topics Performance: ${JSON.stringify(topicPerformance, null, 2)}

Based on this data, provide:
1. Key strengths (topics performed well)
2. Areas for improvement (weak topics)
3. Specific recommendations for improvement
4. Study tips for weak areas

Return a JSON response with the structure:
{
  "strengths": ["strength1", "strength2"],
  "weakTopics": ["topic1", "topic2"],
  "strongTopics": ["topic3"],
  "improvements": ["improvement1", "improvement2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "studyTips": ["tip1", "tip2"]
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      let cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error analyzing test results:', error);
      throw new Error('Failed to analyze test results');
    }
  }
}

module.exports = new GeminiService();
