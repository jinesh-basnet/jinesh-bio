const mongoose = require('mongoose');

async function debugData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/portfolio_db');
        console.log('CONNECTED');

        // Get raw collection
        const collection = mongoose.connection.db.collection('timelines');

        // List all indexes with details
        const indexes = await collection.listIndexes().toArray();
        console.log('--- INDEXES ---');
        console.log(JSON.stringify(indexes, null, 2));

        // Check for any document with an 'id' field
        const docsWithId = await collection.find({ id: { $exists: true } }).toArray();
        console.log('--- DOCS WITH ID FIELD ---');
        console.log(docsWithId.length);
        if (docsWithId.length > 0) {
            console.log(JSON.stringify(docsWithId[0], null, 2));
        }

        // Check for duplicates in 'id' field
        const duplicates = await collection.aggregate([
            { $group: { _id: "$id", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]).toArray();
        console.log('--- DUPLICATE ID VALUES ---');
        console.log(JSON.stringify(duplicates, null, 2));

        await mongoose.disconnect();
        console.log('DISCONNECTED');
    } catch (err) {
        console.error(err);
    }
}

debugData();
