const express = require("express");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const dotenv = require("dotenv");
dotenv.config();
const fileUpload = require("express-fileupload");
const path = require("path");

const config = require("./config/config.js");
const homeRoutes = require("./routes/home.js");
// const connectdb = require("./config/db/index.js");

const app = express();
const port = config.PORT;


//database connection 
// connectdb();
 
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev")); 
app.use(fileUpload());

//Routes
app.use("/", homeRoutes);


app.listen(port, () => {
    console.log(`Server has started at http://localhost:${port}`);
});