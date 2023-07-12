const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/errorHandler");

const dotenv = require("dotenv");
dotenv.config();

//middle ware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//routes
const categoriesRoutes = require("./router/category");
const productRoute = require("./router/productRoute");
const userRoute = require("./router/userRoute");
const orderRoute = require("./router/order");

app.use("/categories", categoriesRoutes);
app.use("/products", productRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute);

//database connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
