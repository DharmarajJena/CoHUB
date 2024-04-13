const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL=process.env.DB_URL;
mongoose.connect(mongoURL);

const db=mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to mongoDB server");
});

db.on('error',()=>{
    console.error("Connection error");
});

module.exports=db;
