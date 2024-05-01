const express = require('express');
const app=express();
const cors=require('cors');
const cookieParser = require('cookie-parser');


const db = require('./db');
const middleware=require('./middleware');

app.use(cors());
app.use(middleware.logRequest);
app.use(cookieParser());

require('dotenv').config();

const bodyParser=require('body-parser');
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

const userRoutes=require('./User/routes');
// const expertRoutes=require('./Experts/routes');

app.use('/',userRoutes);
// app.use('/expert',logRequest,expertRoutes);

const {check}=require('./User/views');


app.get('/hit',middleware.verifyFirebaseToken,async(req,res)=>{
    return res.status(200).json({message:'hit success'});
})

app.get('/get',async(req,res)=>{
    return res.status(200).json({message:'kamariya haye haye'});
})





const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}...`);
    check();
});