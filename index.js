const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');


//Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');



//Config App
const app = express();
require('dotenv').config();


//DB MongooDB

mongoose.connect(process.env.DATABASE)
.then(() => console.log('db connected'))
.catch(() => console.log('not connected'))

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(expressValidator())

//Routes middleware
app.use('/api/user' , authRoutes,  userRoutes);
// app.use('/api' , userRoutes);
app.use('/api/category' , categoryRoutes);
app.use('/api/product' , productRoutes);



const port = process.env.PORT || 3000; 
app.listen(port , ()  => console.log(`app is running on port ${port}`));