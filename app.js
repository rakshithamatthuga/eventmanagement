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
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
app.listen(PORT, (err) => {
    if(err) {
        console.log("Error occured cant start the server");
    } else {
        console.log("Server started successfully");
    }
})

//register a user 
app.post('/register', (req,res)=>{
    let data = req.body;
    console.log(data)
    const msg = {
        to: data.email,
        from: 'rakshithamattuga@gmail.com', // Use your verified SendGrid sender email
        subject: 'Registration Successful',
        text: 'You have successfully registered.'
    };
    const user = {
            email: data.email,
            password: bcrypt.hashSync(data.password, 8),
        }
        //validate data before saving to database
        if(Validator.validateCourseInfo(user).status == true){
        userData.push({'email':user.email,"password":user.password,"creationDate":new Date()})
        res.status(201).send(userData[0])  
        sgMail.send(msg);
  
    }
    else{
        res.status(400).json({"message": "Email is not in a proper format"})
    }
    

})

//login a user 
app.post('/login',(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    const user = userData.find(user => user.email === email)
    //const secret=process.env.SECRET_KEY
    if(user){
        var isPasswordValid = bcrypt.compareSync(password, user.password);
        if(isPasswordValid){
            var token=jwt.sign({id:user.email},process.env.SECRET_KEY,{
                expiresIn: 86400
            })
            if(token){
            res.status(200).json({"message":"Logged In Successfully","token":{token},"expiresIn":"86400"})
            }
        }
        else{
            res.status(401).json({"message":"Unauthorized User"})
        }

    }else{
        res.status(404).json({"message":"User doesn't exist"})
    }
})

//get the news preferences 
app.get('/:id/preferences', (req,res)=>{
    const token=req.header.authorization
    console.log(token)
    const userId=userData.find((id)=>id==req.query.id)
    const designed=jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            res.status(401).json({"message":"Unauthorized User"})
            
        }
        else{
            const preferences=userId.preferences
            res.status(200).json({"message":"User Preferences","preferences":preferences})
            

        }
        
        
    })
   

})
