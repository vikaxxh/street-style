const mongoose = require('mongoose')


const connectDB = () => {

  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then( ( )=> {
    console.log("MongoDB Connected....");
  })

  
}

module.exports = connectDB
