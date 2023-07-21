const mongoose = require('mongoose');
require("dotenv/config");

// connect mongodb 

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}

module.exports = connect();