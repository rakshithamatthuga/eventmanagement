require('dotenv').config();
const express=require('express')
const app=express()
const fs = require('fs');
const Validator = require('../helper/validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const verifyToken = require('../middleware/authJWT');
const { json } = require('express');
const { ApplicationCostProfiler } = require('aws-sdk');
const { nextTick } = require('process');
const PORT = 3000;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userData=[
    {
      "name": "Rakshitha",
      "Id": 90876,
      "userName": "rakshithamattuga@gmail.com",
      "password": 3,
    },
    {
      "name": "Ashritha",
      "userName": "ashritha@gmail.com",
      "password": 3,
    }
  ]

const userRegistration=(req,res)=>{
    let data = req.body;
    console.log(data)
    const msg = {
        to: data.email,
        from: 'rakshithamattuga@gmail.com', // Use your verified SendGrid sender email
        subject: 'Registration Successful',
        text: 'You have successfully registered to Iris Virtual Events Management'
    };
    const user = {
        email: data.email,
        password: bcrypt.hashSync(data.password, 8),
        role: data.role
    }
    
        //validate data before saving to database
        if(Validator.validateInfo(user).status == true){
         
            const randomNumber = Math.floor(1000 + Math.random() * 9000);
            userData.push({'email':user.email,"password":user.password,"creationDate":new Date(),"id":randomNumber,"role":user.role})
        console.log(userData)
        res.status(201).send(userData[0])  
        console.log(userData.id)
        sgMail.send(msg);
  
    }
    else{
        res.status(400).json({"message": "Email is not in a proper format"})
    }
    

}
const loginUser=(req,res)=>{
        let data = req.body;
        const email=req.body.email
        const password=req.body.password
        const user = userData.find(user => user.email === email)
        const secret=process.env.SECRET_KEY
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
    }
let event=[{ 
    "name": "Ashritha",
    "description": 3,
    "participants":['rakshitha','ashritha'],
    "#NumberOfRegistration":2

}]
const createEvent=(req,res,next)=>{
    let eventData = req.body;
    const email=req.body.email;
    const role=req.body.role
    let token=req.headers.authorization
    console.log(token)
    token = token.split(' ')[1];
    const user = userData.find(user => user.email === email)
    console.log(user)
    if(user && user.role=='organizer'){
    const designed=jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            res.status(401).json({"message":"Unauthorized User"})
            next()
        }
        else{
            console.log('coming')
            if(Validator.validateEvents(eventData).status == true){
                const randomNumber = Math.floor(1000 + Math.random() * 9000);
                event.push({'name':eventData.email,"description":eventData.description,"creationDate":new Date(),"participants":eventData.participants,"id":randomNumber})
                res.status(201).json(event[1]) 
                const msg = {
                    to: eventData.email,
                    from: 'rakshithamattuga@gmail.com', // Use your verified SendGrid sender email
                    subject: 'Event Registration',
                    text: event[1].toString()
                };
                sgMail.send(msg);
                next()
            }
            else{
                res.status(400).json({"message":Validator.validateEvents(eventData).message})
                next()
            }
        }
    });
}
else{
    res.status(401).json({"message":"You're not authorized to create an event"})
}
}


//Update events
const updateEvent=(req,res,next)=>{
    let eventData = req.body;
    const email=req.body.email;
    const role=req.body.role
    let token=req.headers.authorization
    token = token.split(' ')[1];
    const user = userData.find(user => user.email === email)
    const eventId=event.find(event=>event.id==req.params.id)
    if(user && user.role=='organizer' && eventId){
    const designed=jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            res.status(401).json({"message":"Unauthorized User"})
            next()
        }
        else{
            console.log('coming')
            eventId.name = eventData.name;
            eventId.description = eventData.description;
            eventId.participants = eventData.participants;
            eventId.creationDate = new Date();
            res.status(200).send(event[1])
            next()
        }
    });
}
else{
    res.status(401).json({"message":"You're not authorized to create an event"})
}
}

const deleteEvent=(req,res,next)=>{
    const email=req.body.email
    const eventId=req.params.id;
    let token=req.headers.authorization
    token = token.split(' ')[1];
    const user = userData.find(user => user.email === email)
    const eventIdc=event.find(event=>event.id==eventId)
    if(user && user.role=='organizer' && eventIdc){
    const designed=jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            res.status(401).json({"message":"Unauthorized User"})
            next()
        }
        else{
            console.log('coming')
            event = removeEventById(event, eventId);
            res.status(204).json({"message":"Event has been deleted"})
            next()
        }
    });
}
else{
    res.status(401).json({"message":"You're not authorized to delete an event"})
    next()
}
}



const eventRegistration=[
    {
        "email":"abc@gmail.com",
        "id":123,
        "name":"RakshithaS",
        "description":"This is a test event",
        "venue":"Bengaluru"
    }
]
const userRegisterEvent = async (req, res, next) => {
    try {
        let eventData = req.body;
        const email = req.body.email;
        const id = req.params.id;
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ "message": "No token provided" });
        }

        token = token.split(' ')[1];
        const user = userData.find(user => user.email === email);
        const eventId = eventRegistration.find(event => event.id == id);

        if (user && user.role === 'attendee' && eventId) {
            // Promisify jwt.verify
            const verifyToken = (token) => {
                return new Promise((resolve, reject) => {
                    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(decoded);
                        }
                    });
                });
            };

            // Verify the token
            const decoded = await verifyToken(token);

            if (Validator.validateEventsInfo(eventData).status === true) {
                eventId.name = eventData.name;
                eventId.email = eventData.description;
                eventId.participants = eventData.name;
                eventId.creationDate = new Date();
                
                res.status(201).json({ "message": "Event Registered and emailed the details" });

                const msg = {
                    to: email,
                    from: 'rakshithamattuga@gmail.com', // Use your verified SendGrid sender email
                    subject: 'Event Registration Details',
                    text: JSON.stringify(eventId, null, 2) // Pretty-print JSON with 2 spaces indentation
                };

                await sgMail.send(msg);
                console.log('Email sent successfully');
            } else {
                res.status(400).json({ "message": Validator.validateEventsInfo(eventData).message });
            }
        } else {
            res.status(401).json({ "message": "You're not authorized to register for this event" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Internal Server Error" });
    }
    next();
};
module.exports = {
    userRegistration,
    loginUser,
    createEvent,
    updateEvent,
    userRegisterEvent,
    deleteEvent
};