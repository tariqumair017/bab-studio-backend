const mongoose = require("mongoose");
const config = require("../config");

const connectdb = async () => {
    try {
        await mongoose.connect(config.DB_URL);
        console.log(`Mongodb is connected ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`this is error ${error}`);
    }
}

module.exports = connectdb; 