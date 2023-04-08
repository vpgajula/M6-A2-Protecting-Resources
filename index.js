//Set enviroment variables
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//Template for Node.js Express Server
const express = require('express');

//Create Express App
const app = express();

const morgan = require('morgan');    //Use morgan for logging purposes

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'))
}

//body-parser is a middleware that parses incoming requests with JSON payloads and is based on body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//routes are defined in the routes folder
const userRoute = require('./routes/userRoutes');
app.use('/api', userRoute);

//Start the Server. Default port is 3000
const port = process.env.PORT || 3000;

//connecting to the database
const mongoose = require('mongoose');

//asynchronous DB connection with parameterized DB connection string
mongoose.connect(`mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.ATLAS_DBSERVER}/${process.env.DATABASE}`
  , { useNewUrlParser: true }, { useUnifiedTopology: true }, { useCreateIndex: true }, { useFindAndModify: false })
  .then(() => console.log(`MongoDB connection succeeded with ${process.env.DATABASE}...`))
  .catch((err) => console.log('Error in DB connection: ' + err));

//app is listening on the port
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
