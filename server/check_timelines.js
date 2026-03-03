const mongoose = require('mongoose');

async function checkData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/portfolio_db');
        console.log('--- Connected ---');

        const collection = mongoose.connection.collection('timelines');
        const indexes = await collection.indexes();
        console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

        const count = await collection.countDocuments();
        console.log('Total documents:', count);

        const sample = await collection.find({}).limit(5).toArray();
        console.log('Sample Data:', JSON.stringify(sample, null, 2));

        await mongoose.disconnect();
        console.log('--- Disconnected ---');
    } catch (error) {
        console.error('Error:', error);
    }
}

checkData();
