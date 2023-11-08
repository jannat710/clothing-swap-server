const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

//port
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pvt8fts.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {


        //collection
        const productCollection = client.db('clothingSwap').collection('services');

        app.post('/services', async (req, res) => {
            const food = req.body;
            console.log(food);
            const result = await productCollection.insertOne(food);
            res.send(result);
        });

        app.get('/services', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Clothing swap server is running')
})

app.listen(port, () => {
    console.log(`Clothing swap server is running on port: ${port}`);
})

