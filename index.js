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
const run = async () => {
  try {
    await client.connect();
    const productCollection = client.db("product").collection("items");
    app.post("/items", async (req, res) => {
      const item = req.body;
      if (!item.name || !item.price) {
        return res.send({
          success: false,
          error: "Pleas give the specific Data ",
        });
      }
      const result = await productCollection.insertOne(item);
      res.send({
        success: true,
        message: `Successfully inserted data ${item.name}`,
      });
    });
    console.log("DATABASE Connected");
  } catch (error) {
    console.log(error);
  }
};
run();

app.get("/", (req, res) => {
  res.send("BookHouse Server Is Running");
});

app.listen(port, () => {
  console.log("Listening on Port", port);
});
