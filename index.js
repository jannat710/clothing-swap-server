const express = require('express');
const cors = require('cors');
const app = express();
var jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const userCollection = client.db('clothingSwap').collection('users');
        const testimonialsCollection = client.db('clothingSwap').collection('testimonials');
        const serviceCollection = client.db('clothingSwap').collection('services');


        //jwt
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
            res.send({ token });
        })
        //middleware
        const verifyToken = (req, res, next) => {
            console.log('inside verify token', req.headers.authorization);
            if (!req.headers.authorization) {
                return res.status(401).send({ message: 'unauthorized access' });
            }
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ message: 'unauthorized access' })
                }
                req.decoded = decoded;
                next();
            })
        }

        //services data load
        app.get('/services', async (req, res) => {
            console.log(req.headers);
            const result = await serviceCollection.find().toArray();
            res.send(result);
        })

            // load single service data
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }

        const options = {
            projection: { serviceArea: 1, serviceProviderImage: 1 },
        };

        const result = await serviceCollection.findOne(query, options);
        res.send(result);
    })


        //testimonials data load
        app.get('/testimonials', async (req, res) => {
            const result = await testimonialsCollection.find().toArray();
            res.send(result);
        })

        //user related API
        app.get('/users', async (req, res) => {

            const result = await userCollection.find().toArray();
            res.send(result);
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })




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
        //load single services


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

