const express = require('express')
const app = express()
const cookieParser = require("cookie-parser")
const errorMiddleware = require('./middleware/error')
const bodyParser = require('body-parser')
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
require("dotenv").config({ path: "config/.env" });
const cloudinary = require("cloudinary");

app.use(express.json())
app.use(cookieParser())
//Route Import
const product = require("./routes/productRoute")
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute')
const payment = require('./routes/paymentRoute')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use('/api/v1' , product)
app.use('/api/v1', user)
app.use('/api/v1', order)
app.use("/api/v1", payment);

app.use(errorMiddleware)

module.exports  = app