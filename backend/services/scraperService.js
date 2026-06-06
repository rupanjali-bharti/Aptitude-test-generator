const axios = require('axios');
const cheerio = require('cheerio');

class ScraperService {
  async scrapeIndiabixQuestions(category = 'quantitative-aptitude', limit = 10) {
    try {
      // Note: This is a template. Actual implementation depends on website structure
      // For production, you may need to handle dynamic content with Puppeteer
      const url = `https://www.indiabix.com/aptitude/${category}/`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const questions = [];

      // This selector might need adjustment based on actual website structure
      $('div.question').slice(0, limit).each((index, element) => {
        const questionText = $(element).find('div.questionText').text().trim();
        const options = [];
        $(element).find('input[type="radio"]').each((idx, opt) => {
          const optionText = $(opt).closest('label').text().trim();
          if (optionText) options.push(optionText);
        });

        if (questionText && options.length === 4) {
          questions.push({
            text: questionText,
            options: options,
            topic: category,
            source: 'indiabix',
            difficulty: 'medium' // Default, might need to parse from website
          });
        }
      });

      return questions;
    } catch (error) {
      console.error('Error scraping Indiabix:', error);
      return [];
    }
  }

  async scrapeMultipleSourcesForTopic(topic, numberOfQuestions = 5) {
    try {
      // Combine questions from multiple sources
      const questions = [];
      
      // Attempt to scrape from indiabix
      const indiabixQuestions = await this.scrapeIndiabixQuestions(topic, numberOfQuestions);
      questions.push(...indiabixQuestions);

      return questions.slice(0, numberOfQuestions);
    } catch (error) {
      console.error('Error scraping multiple sources:', error);
      return [];
    }
  }
}

module.exports = new ScraperService();
