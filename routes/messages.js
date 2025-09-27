const express = require("express");
const router = express.Router();    
const auth = require("../middlewares/auth");
const Message = require("../models/messages"); 


// create message
router.post("/create", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name && !email && !phone && !message) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const messageDoc = await Message.create(req.body);

        return res.status(201).json({ message: "Message created", message: messageDoc });
    } catch (err) {
        return res.status(500).json({ message: "Failed to create message", error: err.message });
    }
});

// get all messages
router.get("/get-all", auth, async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        return res.json({ messages });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch messages", error: err.message });
    }
});

// get message by id
router.get("/get-single/:id", auth, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Message ID is required" });
        }
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: "Message not found" });
        return res.json({ message });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch message", error: err.message });
    }
});

// delete message by id
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Message ID is required" });
        }

        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: "Message not found" });

        await Message.findByIdAndDelete(req.params.id);
        return res.json({ message: "Message deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete message", error: err.message });
    }
});

module.exports = router;
