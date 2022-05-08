const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
const port = process.env.PORT || 4000;

const app = express();

// middleware intermigration
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION AND API

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5olip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  console.log("BookHouse Db Connected");
  client.close();
});

app.get("/", (req, res) => {
  res.send("BookHouse Server Is Running");
});

app.listen(port, () => {
  console.log("Listening on Port", port);
});
