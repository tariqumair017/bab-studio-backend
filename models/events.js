const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        displayImage: { type: String, required: true },
        description: { type: String, required: true },
        images: [
            {
                url: { type: String, required: true },
                key: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);


