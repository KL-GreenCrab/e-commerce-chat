const mongoose = require('mongoose');
const config = require('./config');

console.log('Attempting to connect to MongoDB at:', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        
        // Test if we can access the database
        mongoose.connection.db.admin().ping()
            .then(() => {
                console.log('MongoDB server is responsive');
                
                // List all collections
                return mongoose.connection.db.listCollections().toArray();
            })
            .then(collections => {
                console.log('Available collections:');
                collections.forEach(collection => {
                    console.log(`- ${collection.name}`);
                });
                
                // Close the connection
                mongoose.disconnect();
                console.log('Connection closed');
            })
            .catch(err => {
                console.error('Error testing MongoDB connection:', err);
                mongoose.disconnect();
            });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });
