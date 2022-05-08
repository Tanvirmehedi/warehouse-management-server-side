const express = require("express");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 4000;

const app = express();

// middleware intermigration
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BookHouse Server Is Running");
});

app.listen(port, () => {
  console.log("Listening on Port", port);
});
