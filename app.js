const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const fileUpload = require("express-fileupload");

const config = require("./config/config.js");
const eventRoutes = require("./routes/events.js");
const messageRoutes = require("./routes/messages.js");
const authRoutes = require("./routes/auth.js");
const connectdb = require("./config/db/index.js");

const app = express();
const port = config.PORT;

const allowedOrigins = [
  'http://localhost:5173',
  'https://bab-studio.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

//database connection 
connectdb();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan("dev")); 
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  limitHandler: (req, res) => {
    res.status(413).json({
      error: 'File size too large. Maximum allowed size is 50MB per file.'
    });
  },
  abortOnLimit: true,
  responseOnLimit: 'File size limit has been reached'
}));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/message", messageRoutes);


app.listen(port, () => {
    console.log(`Server has started at http://localhost:${port}`);
});