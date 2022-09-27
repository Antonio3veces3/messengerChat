require('dotenv').config();
const mongoose = require('mongoose');
const urlDB = process.env.MONGODB_CNN;
const optionsDB = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    useNewUrlParser: true, 
    useUnifiedTopology: true,  
};


const dbConnection = async() => {
    try {
        await mongoose.connect(urlDB, optionsDB);
        console.log('Connected to MONGO DB', urlDB);
    } catch (error) {
        console.log(error);
        throw new Error('Database connection failed')
    }
};

module.exports = {
    dbConnection
}