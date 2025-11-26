const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config();
const cors = require("cors"); 
const connectDB = require('./src/DB/conn');
const path = require('path');
const cookieParser = require('cookie-parser');

// Routes

const userRoutes = require('./src/routes/userRoutes');

const app = express();

connectDB();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// routes path
app.use('/user', userRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
})
