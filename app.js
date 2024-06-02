// require('dotenv').config();
const express=require('express')
const app=express()
const fs = require('fs');
const Validator = require('./helper/validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const verifyToken = require('./middleware/authJWT');
const { json } = require('express');
const { ApplicationCostProfiler } = require('aws-sdk');
const { nextTick } = require('process');
const PORT = 3000;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const {userRegistration,loginUser,createEvent,updateEvent,userRegisterEvent,deleteEvent} = require('./routers/route')
const router = express.Router();

const userData=[
    {
      "name": "Rakshitha",
      "Id": 90876,
      "userName": "rakshitha@gmail.com",
      "password": 3,
      "preferences": "Technical"
    },
    {
      "name": "Ashritha",
      "Id": 90876,
      "userName": "ashritha@gmail.com",
      "password": 3,
      "preferences": "Technical"
    }
  ]
app.use(express.json())
router.post('/register',userRegistration)
router.post('/login',loginUser)
router.post('/events',createEvent)
router.put('/events/:id',updateEvent)
router.post('/events/:id/register',userRegisterEvent)
router.delete('/events/:id',deleteEvent)
app.use('/api', router);
app.listen(PORT, (err) => {
    if(err) {
        console.log("Error occured cant start the server");
    } else {
        console.log("Server started successfully");
    }
})
