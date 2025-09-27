const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true },
        message: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messagesSchema);


