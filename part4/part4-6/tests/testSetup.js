const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://fullstack:2r6FcH9cLQRdnXHJ@cluster0.xgr0xci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

// Function to connect to the test database
const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db('testdb'); // Use a specific database for testing
    await db.command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

// Function to close the database connection
const closeDatabaseConnection = async () => {
  try {
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Failed to disconnect from MongoDB", error);
  }
};

// Function to clear the database before each test
const clearDatabase = async () => {
  try {
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
    console.log("Database cleared");
  } catch (error) {
    console.error("Failed to clear database", error);
  }
};

// Function to initialize test data
const initializeTestData = async () => {
  const initialBlogs = [
    { title: 'Introduction to JavaScript', content: 'JavaScript is a versatile programming language.', published: true },
    { title: 'Understanding HTTP', content: 'HTTP is the foundation of data communication on the web.', published: false },
  ];
  try {
    const blogCollection = db.collection('blogs');
    await blogCollection.insertMany(initialBlogs);
    console.log("Test data initialized");
  } catch (error) {
    console.error("Failed to initialize test data", error);
  }
};

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  clearDatabase,
  initializeTestData
};
