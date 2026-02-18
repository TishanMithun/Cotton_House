const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    try {
        const dbUrl=process.env.MONGO_URI

        const conn = await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000 
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err + 'MongoDB database not connected');
    }

}

module.exports = connectDB;