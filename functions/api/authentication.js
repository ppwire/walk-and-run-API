const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const authverify = require('./middleware')
const passwordHash = require('password-hash');
let connection = mysql.createPool({
    host: process.env.publicip,
    user: process.env.DB_USERNAME,
    password: process.env.password,
    database: process.env.dbname,
    socketPath: '/cloudsql/' + process.env.instance
});


// let connection = mysql.createPool({
//     host: process.env.publicip,
//     user: process.env.DB_USERNAME, // e.g. 'my-db-user'
//     password: process.env.password, // e.g. 'my-db-password'
//     database: process.env.dbname, // e.g. 'my-database'
// });

router.post('/gettoken', async (req, res) => {
    query = `select userid,userpassword,username,userrole from user where userid="${req.body.userid}"`
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            if (results.length == 0) {
                res.status(200).json({
                    message: "Not Found User",
                    data: results,
                    status: 'invalid'
                })
            } else {
                console.log();
                let verify = 'invalid'
                if (passwordHash.verify(results[0].userpassword, req.body.userpw)) {
                    verify = 'valid'
                }
                const user = {
                    username: req.body.userid
                }
                console.log(process.env.ACCESS_TOKEN_SECRET)
                console.log(results)
                jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
                    if (err) {
                        res.status(403)
                    } else {
                        console.log(token)
                        res.json({
                            access_token: token,
                            username: results[0].username,
                            userrole: results[0].userrole,
                            verify: verify
                        })
                    }
                })
                console.log('select complete')
            }
        }
    });
})

router.post('/verifyauth', authverify.verifytoken, (req, res) => {
    res.json({
        user: req.user
    })
})



module.exports = router;