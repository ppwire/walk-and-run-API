const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');


module.exports.verifytoken = function authenticateToken(req,res,next){
    var token = req.headers.authorization.split(' ')[1];

    if(token === null ) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            console.log(err)
            return res.sendStatus(403)
        }
        req.user = user.user.username
        console.log(user.user.username)
        next()
    })
}
