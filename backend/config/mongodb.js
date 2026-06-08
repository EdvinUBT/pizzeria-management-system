const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB i lidhur me sukses');
    } catch (error) {
        console.error('Gabim ne lidhjen me MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectMongoDB;