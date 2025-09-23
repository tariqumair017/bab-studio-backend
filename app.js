const express = require("express");
const morgan = require("morgan"); 
const dotenv = require("dotenv");
dotenv.config();
const fileUpload = require("express-fileupload"); 

const config = require("./config/config.js");
const eventRoutes = require("./routes/events.js");
const connectdb = require("./config/db/index.js");

const app = express();
const port = config.PORT;


//database connection 
// connectdb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev")); 
app.use(fileUpload());

//Routes
app.use("/api/event", eventRoutes);


app.listen(port, () => {
    console.log(`Server has started at http://localhost:${port}`);
});