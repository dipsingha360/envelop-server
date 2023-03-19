require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");

// app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// endpoints
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

// port
const PORT = process.env.PORT || 4000;

// connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((req, res) => {
    // listing request
    app.listen(PORT, (req, res) => {
      console.log(`Connected to DB and listing on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
