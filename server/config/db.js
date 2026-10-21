const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/agri-transport';
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.error('Please verify your MONGO_URI environment variable is configured properly.');
        process.exit(1);
    }
};

module.exports = connectDB;
