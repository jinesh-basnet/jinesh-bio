const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Project = require('./models/Project');

const cleanDuplicates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db');
        console.log('Connected to MongoDB');

        const projects = await Project.find();
        const urls = new Set();
        let deletedCount = 0;

        for (const project of projects) {
            if (urls.has(project.html_url)) {
                await Project.findByIdAndDelete(project._id);
                console.log(`Deleted duplicate: ${project.name} (${project.html_url})`);
                deletedCount++;
            } else {
                urls.add(project.html_url);
            }
        }

        console.log(`Cleanup complete. Deleted ${deletedCount} duplicate projects.`);
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
};

cleanDuplicates();
