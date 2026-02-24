const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/SKYSQLStudio';
        await mongoose.connect(uri);
        console.log('📦 MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        throw err;
    }
};

module.exports = connectMongoDB;
