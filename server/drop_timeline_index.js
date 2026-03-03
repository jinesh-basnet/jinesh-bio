const mongoose = require('mongoose');

async function dropIndex() {
    try {
        await mongoose.connect('mongodb://localhost:27017/portfolio_db');
        console.log('--- Connected to MongoDB ---');

        const collection = mongoose.connection.collection('timelines');
        const indexExists = await collection.indexExists('id_1');

        if (indexExists) {
            console.log('Index id_1 exists. Dropping...');
            await collection.dropIndex('id_1');
            console.log('Index id_1 dropped successfully.');
        } else {
            const indexes = await collection.indexes();
            console.log('Index id_1 does not exist in:', indexes.map(i => i.name));
        }

        await mongoose.disconnect();
        console.log('--- Disconnected ---');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

dropIndex();
