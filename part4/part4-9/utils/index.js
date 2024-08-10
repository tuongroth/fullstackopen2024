const app = require('./app') // The Express app
const config = require('./utils/config')
const logger = require('./utils/logger')


app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fullstack:2r6FcH9cLQRdnXHJ@cluster0.xgr0xci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
