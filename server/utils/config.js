require('dotenv').config()
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const PORT = process.env.PORT

const MONGODB_URI = process.env.MONGODB_URI

function connectToMongoServer () {
  mongoose.connect(config.MONGODB_URI, () => {
    console.log(`connected to ${config.MONGODB_URI}`)
  }).catch(err => {
    console.log(`couldnt connect because ${err.message}`)
  })
}

async function initializeMongoServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  try {
    await mongoose.connect(mongoUri);
  }
  catch(err){
    console.log(err)
  }

  

  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
}


module.exports = { PORT, MONGODB_URI, initializeMongoServer,connectToMongoServer }