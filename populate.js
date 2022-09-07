require("dotenv").config();

const connectDB = require("./db/connect");

const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  //connect DB
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("Running");
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

start();
