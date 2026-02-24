const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || mongodb+srv://saikumarkalva10_db_user:k1lqzmaQ8OVGohpa@sqlcluster.dd2djrf.mongodb.net/?appName=SQLCluster;
        await mongoose.connect(uri);
        console.log('📦 MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        throw err;
    }
};

module.exports = connectMongoDB;
