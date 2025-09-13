const express = require("express");
const router = express.Router();   


// render Home
router.get("/", async (req, res) => {
  res.render("Home");
});


module.exports = router;
