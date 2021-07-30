// const express = require('express');
// const router = express.Router();
// const User = require('../../models/user');
// const Image = require('../../models/image');
// const mongoose = require('mongoose');

// var request = require('request');   
// var querystring = require('querystring')



// router.post("/",async(req,res,next) => {
//     console.log("sending user");
//     try {
//         var user = new User(req.body);
//         var result = await user.save();
//         res.send(result)
//     }catch(error){
//         res.status(500).send(error);
//     }

// });



// router.post("/uploading",(req,res,next) =>{
//     console.log("sending image");
//     try{ 
//         let result ;
//         var image = new Image(req.body);
//         const form_data = {
//             'urls': req.body.url
//         }
//         const options =  {
//             url : "https://app.nanonets.com/api/v2/OCR/Model/0709fef5-fa76-4325-b79d-3c4ace3a8bf7/LabelUrls/",
//             body: querystring.stringify(form_data),
//             headers: {
//                 'Authorization' : 'Basic ' + Buffer.from('tTQ0UljFbW32rs-N1rHH_-KGIlswvASk' + ':').toString('base64'),
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         }
         
//          request.post(options, function(err, httpResponse, body) {
//             console.log(body)
//             console.log(JSON.parse(body));
//             var exres =  JSON.parse(body);
//             image.set('status',exres.message);
//             result =   image.save();
//         })

//         res.status(201).json({
//             message:"Uploading complete",
//             results : result
//         });
       
        
//     }catch{
//         res.status(500).send(error);
//     }

// });

// module.exports = router;










