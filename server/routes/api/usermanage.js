const express = require('express');
const router = express.Router();
const sql = require('../../index');


router.post("/insert", async (req, res, next) => {

    query = `insert into user values("${req.body.userid}","${req.body.username}","${req.body.userlast}","${req.body.usersection}","${req.body.userpassword}")`


    // sql.query(query, function (err, result) {
    //     if (err) {
    //         throw err;
    //         res.status(500).send(err);
    //     }
    //     console.log('Insert Complete')
    //     res.status(201).json({
    //         message: "Yo!",
    //         results: "yeeyye"
    //     });
    // })



    insert = sql.query(query, function (err) {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "insert Complete"
            })
            console.log('insert complete')
        }
    });

});

router.post("/select", async(req,res) =>{
    query = `select * from user`

    select = sql.query(query, function (err,results) {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "Select Complete",
                data:results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})



module.exports = router;