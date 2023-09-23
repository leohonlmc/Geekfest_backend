const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/AuthRoutes");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const server = createServer(app);

mongoose.set("strictQuery", false);

app.set("trust proxy", 1);

server.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listen on PORT ${process.env.PORT}`);
  }
});

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(
  cors({
    origin: ["http://localhost:3000", "https://keyholder.onrender.com"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
    secure: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use("/", authRoutes);
