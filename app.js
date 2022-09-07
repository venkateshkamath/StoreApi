require("dotenv").config();
//async Errors
require("express-async-errors");

const express = require("express");

const app = express();

const connectDB = require("./db/connect");
const productsRoute = require("./routes/products");
const notFoundMiddleware = require("./middleware/not-found");

const errorMiddleware = require("./middleware/error-handler");

//middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Products Page</a>');
});
app.use("/api/v1/products/", productsRoute);
//products route
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    //DB Connection
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log("Server is Listening on PORT 3000"));
  } catch (error) {
    console.log("connection failed");
  }
};

start();
