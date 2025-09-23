const express = require("express");
const router = express.Router();   


// create event
router.post("/create", auth, async (req, res) => {
  
});

// get all events
router.get("/get-all", auth, async (req, res) => {
  
});

// get vevnt by id
router.get("/get-single/:id", auth, async (req, res) => {
  
});


module.exports = router;
