/**
 * Author: Professor Krasso
 * Date: 7 August 2024
 * File: app.js
 * Description: Application setup. Autogenerated using Express generator.
 *
 * mongodb+srv://<db_username>:<db_password>@bellevueuniversity.lftytpq.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity
 */

// require statements
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const { notFoundHandler, errorHandler } = require('./error-handler');
// Importing the index router
const indexRouter = require('./routes/index');
const gardenRouter = require('./models/garden');
const plantRouter = require('./models/plant');
// Variable declaration for the express app
let app = express();
// Mongoose connection
const connectionString ='mongodb+srv://gms_user:s3cret>@bellevueuniversity.lftytpq.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity';
const dbName = 'gms'; // Database name
// Function to connect to the database
async function connectToDatabase() {
try {
await mongoose.connect(connectionString, {
dbName: dbName,
});

console.log(`Connection to the '${dbName}' database was successful`);
} catch (err) {
console.error(`MongoDB connection error: ${err}`);
}
}
connectToDatabase(); // Call the function to connect to the database
// CORS configuration
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*'); // This allows all origins
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); // Allowed request methods
res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept'); // Allowed headers
next();
});
// Express app configuration
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Routing configuration
app.use('/api', indexRouter);
app.use('/api/gardens', gardenRouter);
app.use('/api/plants', plantRouter);
// Use the error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);
// Export the app
module.exports = app;