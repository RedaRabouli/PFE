const express = require('express');
const mongoose = require('mongoose');


//Import Routes
const userRoutes = require('./routes/users');



//Config App
const app = express();
require('dotenv').config();


//DB MongooDB

mongoose.connect(process.env.DATABASE)
.then(() => console.log('db connected'))
.catch(() => console.log('not connected'))

//Routes middleware
app.use('/api/users' , userRoutes);



const port = process.env.PORT || 3000; 
app.listen(port , ()  => console.log(`app is running on port ${port}`));