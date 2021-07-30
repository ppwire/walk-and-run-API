// const express = require('express');
// const router = express.Router();
// const User = require('../../models/user');
// const mongoose = require('mongoose');

// var request = require('request');   
// var querystring = require('querystring')

// router.post("/",async (req,res,next) => {
//     const user = new User({
//         name:req.body.name,
//         lastname:req.body.lastname,
//         email:req.body.email,
//         section:req.body.section,
//         password:req.body.password
//     })

//     try{
//         console.log(req.body);
//         console.log(user);
//         const pushuser = await user.save()
//         res.status(201).json({
//             message:"Yo!",
//             results : "yeeyye"
//         });
//     }  catch(error){
//         res.status(500).send(error);
//     }
    
// });

// router.post("/finduser",async(req,res) =>{
//     try{
//         const getuser = await User.findOne({
//             email: req.body.email,
//             password: req.body.password
//         })
//         console.log(getuser)
//         if(getuser == null){
//             res.status(200).json({
//                 message:"invalid"
//             });
//         }else{
//             res.status(200).json({
//                 message:"valid",
//                 id:req.body.email
//             });
//         }
//     }  catch(error){
//         res.status(500).send(error);
//     }
// });


// module.exports = router;