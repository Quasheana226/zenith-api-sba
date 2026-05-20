const mongoose = require('mongoose');
const connectedDB = async () => {
    try{
        // try to connect using the uri stored safely in .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message); 
        process.exit(1); // Exit with failure  
    }
}
module.exports = connectedDB;