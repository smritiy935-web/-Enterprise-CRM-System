const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('Attempting to connect to Atlas...');
mongoose.connect(uri)
  .then(() => {
    console.log('-----------------------------------------');
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    console.log('Database Name:', mongoose.connection.name);
    console.log('-----------------------------------------');
    process.exit(0);
  })
  .catch(err => {
    console.error('-----------------------------------------');
    console.error('CONNECTION FAILED!');
    console.error('Error:', err.message);
    console.error('-----------------------------------------');
    process.exit(1);
  });
