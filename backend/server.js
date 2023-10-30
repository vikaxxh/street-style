const app = require('./app')
const connectDB = require('./config/database')


//handling uncaught exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.massage}`);
    console.log(`Shuting down the server due to Uncaught error`)
    process.exit(1);
})

connectDB();

const server = app.listen(process.env.PORT ,() =>{
    console.log(`server is running on port ${process.env.PORT}...`);
})



// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});