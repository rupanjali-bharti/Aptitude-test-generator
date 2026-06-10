const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Make sure you have your MONGO_URI in backend/.env

// Import your model
const Question = require('./models/Question');

// Path to where your Python script saved the JSON files
const OUTPUTS_DIR = path.join(__dirname, '../data-extraction/outputs');

const seedDatabase = async () => {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // 2. Read all files in the outputs directory
        const files = fs.readdirSync(OUTPUTS_DIR);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        if (jsonFiles.length === 0) {
            console.log('❌ No JSON files found in data-extraction/outputs/');
            process.exit();
        }

        let totalInserted = 0;

        // 3. Loop through each file and insert data
        for (const file of jsonFiles) {
            const filePath = path.join(OUTPUTS_DIR, file);
            const fileData = fs.readFileSync(filePath, 'utf-8');
            const questionsArray = JSON.parse(fileData);

            // Insert into MongoDB
            await Question.insertMany(questionsArray);
            console.log(`📥 Inserted ${questionsArray.length} questions from ${file}`);
            totalInserted += questionsArray.length;
        }

        console.log(`\n🎉 SUCCESS! A total of ${totalInserted} questions are now in your database!`);
        process.exit();

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();