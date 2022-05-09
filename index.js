const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // Post Api
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

    // Get Request
    app.get("/items", async (req, res) => {
      const cursor = productCollection.find();
      const items = await cursor.toArray();
      if (!items?.length) {
        return res.send({ success: false, error: "No Data Found" });
      }
      res.send({ success: true, data: items });
    });

    // Limit Request
    app.get("/item", async (req, res) => {
      const cursor = productCollection.find().limit(6);
      const items = await cursor.toArray();
      if (!items?.length) {
        return res.send({ success: false, error: "No Data Found" });
      }
      res.send({ success: true, data: items });
    });

    // Single item API
    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await productCollection.findOne(query);
      if (!item) {
        return res.send({ success: false, error: "Id Is Not Found" });
      }
      res.send({ success: true, data: item });
    });

    // Update API
    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: ObjectID(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: update,
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      if (!result) {
        return res.send({ success: false, error: "Id Is Not Found" });
      }
      res.send({ success: true, data: item });
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
