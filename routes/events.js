const express = require("express");
const router = express.Router();   
const auth = require("../middlewares/auth");
const Event = require("../models/events");
const { uploadBufferToS3, deleteImageFromS3 } = require("../utils/s3");


// create event
router.post("/create", auth, async (req, res) => {
    try {
        const { name, date, location, description } = req.body;
        if (!name || !date || !location || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Files: expect displayImage (single) and images (array)
        if (!req.files || !req.files.displayImage) {
            return res.status(400).json({ message: "displayImage file is required" });
        }

        const displayImageFile = req.files.displayImage;
        const displayUpload = await uploadBufferToS3(
            displayImageFile.data,
            displayImageFile.mimetype,
            "events/display/"
        );

        const imagesMeta = [];
        if (req.files.images) {
            const imagesArray = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            for (const file of imagesArray) {
                const upload = await uploadBufferToS3(file.data, file.mimetype, "events/gallery/");
                imagesMeta.push({ url: upload.url, key: upload.key });
            }
        }

        const eventDoc = await Event.create({
            name,
            date: new Date(date),
            location,
            description,
            displayImage: displayUpload.url,
            images: imagesMeta,
        });

        return res.status(201).json({ message: "Event created", event: eventDoc });
    } catch (err) {
        return res.status(500).json({ message: "Failed to create event", error: err.message });
    }
});

// get all events
router.get("/get-all", async (req, res) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 });
        return res.json({ events });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch events", error: err.message });
    }
});

// get event by id
router.get("/get-single/:id", async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Event ID is required" });
        }
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        return res.json({ event });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch event", error: err.message });
    }
});

// delete event by id
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Delete images from S3
        for (const image of event.images) {
            await deleteImageFromS3(image.key);
        }

        await Event.findByIdAndDelete(req.params.id);
        return res.json({ message: "Event deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete event", error: err.message });
    }
});

module.exports = router;
