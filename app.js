const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require("dotenv").config();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxhpsct.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function run() {
    try {
        const allProducts = client.db('BuyWise').collection('products');

        app.get("/", async (req, res) => {
            res.send(`BuyWise Server Running On Port: ${port}`);
        });
        app.get("/all-products", async (req, res) => {
            const query = {};
            const cursor = allProducts.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get("/product-details/:id", async (req, res) => {
            const id = req.params.id;
            const query = { '_id': new ObjectId(id) };
            const product = await allProducts.findOne(query);
            res.send(product);
        });
    }
    finally { }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`BuyWise Server Running On Port:${port}`)
});