const app = require("./server");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

// setup the necessary environment variables
dotenv.config();

const port = process.env.PORT || 8000;
const dbUri = process.env.MFLIX_DB_URI;

const mongoClient = new MongoClient(dbUri, {
  connectTimeoutMS: 2000,
  retryWrites: true,
  useNewUrlParser: true,
});

mongoClient.connect(function (err, client) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  }

  if (client) {
    console.log("DB connection successful");
    app.listen(port, () => {
      console.log(`server started listening at port ${port}...`);
    });
  }
});
