const express = require('express');
const authverify = require('./middleware')
const router = express.Router();


/// => Connection TO DB
const mysql = require('mysql');




    let connection = mysql.createPool({
        host: process.env.publicip,
        user: process.env.DB_USERNAME, // e.g. 'my-db-user'
        password: process.env.password, // e.g. 'my-db-password'
        database: process.env.dbname, // e.g. 'my-database'
        socketPath: '/cloudsql/' + process.env.instance
    });



// let connection = mysql.createPool({
//     host: process.env.publicip,
//     user: process.env.DB_USERNAME, // e.g. 'my-db-user'
//     password: process.env.password, // e.g. 'my-db-password'
//     database: process.env.dbname, // e.g. 'my-database'
// });



///Insert Event
router.post("/insertevent", async (req, res) => {
    query = `insert into event values("${req.body.eventtitle}${req.body.eventdate}","${req.body.eventtitle}","${req.body.eventdate}","${req.body.eventdes}","${req.body.eventtype}","${req.body.eventvalue}")`

    connection.query(query, (err) => {
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
})

router.post('/deleteevent', (req, res) => {
    query = `DELETE FROM event WHERE eventid = "${req.body.eventid}"`

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Delete Complete",
                result: results
            })
            console.log('Delete complete')
            console.log(results)
        }
    });
})

router.post("/updateevent", (req, res) => {
    query = `update event set eventid = "${req.body.eventtitle}${req.body.eventdate}", eventtitle = "${req.body.eventtitle}", eventdate = "${req.body.eventdate}", eventdes = "${req.body.eventdes}", eventtype = "${req.body.eventtype}" , eventvalue = "${req.body.eventvalue}" WHERE eventid = "${req.body.eventid}" `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "Upadte Complete",
            })
            console.log('Upadte complete')
        }
    });
})


///Get All Event
router.post("/getallevent", (req, res) => {
    query = `select * from event `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Select Complete",
                data: results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

///Get Event by date
router.post("/geteventbydate", (req, res) => {
    query = `select * from event where eventdate=${req.body.eventdate} `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Select Complete",
                data: results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

///Get All section
router.post("/getallsection", (req, res) => {
    query = `select * from section where sectionid != "ADMIN"`

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {

            let i = 0
            for (i = 0; i < results.length; i++) {


                switch (results[i].sectionday) {
                    case "M":
                        results[i].sectionday = "จันทร์"
                        break;
                    case "T":
                        results[i].sectionday = "อังคาร"
                        break;
                    case "W":
                        results[i].sectionday = "พุธ"
                        break;
                    case "H":
                        results[i].sectionday = "พฤหัส"
                        break;
                    case "F":
                        results[i].sectionday = "ศุกร์"
                        break;
                    case "S":
                        results[i].sectionday = "เสาร์"
                        break;
                    case "U":
                        results[i].sectionday = "อาทิตย์"
                        break;
                    default:
                        break;
                }

            }


            res.status(200).json({
                message: "Select Complete",
                data: results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

//Get User by section 
router.post("/getuserbysection", (req, res) => {
    query = `select userid,username,userlastname,userdepartment,usernumber,usernumber,userprofile from user where usersection="${req.body.usersection}" `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Select Complete",
                data: results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

//Update userwork by admin 

router.post('/updateuserworkbyadmin', (req, res) => {
    query = `update userwork set userworkcal = "${req.body.userworkcal}", userworkdate = "${req.body.userworkdate}", userworkstarttime = "${req.body.userworkstarttime}", userworkdistance = "${req.body.userworkdistance}", userworktime = "${req.body.userworktime}", userworkpace = "${req.body.userworkpace}" where userid="${req.body.userid}" and userworkdate="${req.body.userworkolddate}" `
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "update success"

            })
            console.log('update complete')
            console.log(results)
        }
    });
})


//Get All Section specific number
router.post("/getallsectionnum", (req, res) => {
    query = `select * from section where sectionid != "ADMIN" `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {

            let sectiondetail = [], sectionkey = []
            let i

            for (i = 0; i < results.length; i++) {
                switch (results[i].sectionday) {
                    case "M":
                        results[i].sectionday = "จันทร์"
                        break;
                    case "T":
                        results[i].sectionday = "อังคาร"
                        break;
                    case "W":
                        results[i].sectionday = "พุธ"
                        break;
                    case "H":
                        results[i].sectionday = "พฤหัส"
                        break;
                    case "F":
                        results[i].sectionday = "ศุกร์"
                        break;
                    case "S":
                        results[i].sectionday = "เสาร์"
                        break;
                    case "U":
                        results[i].sectionday = "อาทิตย์"
                        break;
                    default:
                        break;
                }
                let temptext = ""
                temptext = results[i].sectionday + " " + results[i].sectiontime + " เซคชั่นที่:" + results[i].sectionnumber + " ปีการศึกษา:" + results[i].sectionyear + " เทอม:" + results[i].sectionsemester
                sectiondetail.push(temptext)
                sectionkey.push(results[i].sectionid)
            }
            let section = { sectiondetail, sectionkey }

            res.status(200).json({
                message: "Select Complete",
                data: section,
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

//Get Section year from all
router.post("/getallsectionbyyear", (req, res) => {
    query = `select sectionyear from section where sectionid != "ADMIN"`

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Select Complete",
                data: results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

router.post('/deletesection', (req, res) => {
    query = `delete from section where sectionid="${req.body.sectionid}"`

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Delete Complete",
            })
            console.log('Delete complete')
        }
    });
})


///Insert Section 

router.post("/insertsection", (req, res) => {
    query = `insert into section value("${req.body.sectionnumber}${req.body.sectionday}${req.body.sectionyear}${req.body.sectionsemester}","${req.body.sectionday}","${req.body.sectiontime}","${req.body.sectionnumber}","${req.body.sectionyear}","${req.body.sectionsemester}") `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "Insert Complete",
            })
            console.log('Insert complete')
        }
    });
})

//Update Section
router.post("/updatesection", (req, res) => {
    query = `Update section set sectionid = "${req.body.sectionnumber}${req.body.sectionday}${req.body.sectionyear}${req.body.sectionsemester}",sectionday = "${req.body.sectionday}",sectiontime = "${req.body.sectiontime}",sectionnumber = "${req.body.sectionnumber}",sectionyear = "${req.body.sectionyear}",sectionsemester = "${req.body.sectionsemester}" where sectionid = "${req.body.sectionid}" `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "Update Complete",
            })
            console.log('Update complete')
        }
    });
})

///Get User by Section
router.post("/getuserbysec", (req, res) => {
    query = `select username,userlastname,usersection,userdepartment from user where usersection="${req.body.sectionnumber}"`

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Select Complete",
                data: results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

router.post('/getallboard', (req, res) => {
    query = `select * from board order by boarddate DESC `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Select Complete",
                data: results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

router.post('/deleteboard', (req, res) => {
    query = `DELETE FROM board WHERE boardid = "${req.body.boardid}"`

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(200).json({
                message: "Delete Complete",
                result: results
            })
            console.log('Delete complete')
            console.log(results)
        }
    });
})

router.post("/insertboard", authverify.verifytoken, (req, res) => {
    query = `insert into board value("${req.user}${req.body.boarddate}${req.body.boardhead}","${req.body.boardtext}","${req.body.boardhead}","${req.user}","${req.body.boarddate}") `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "Insert Complete",
            })
            console.log('Insert complete')
        }
    });
})

router.post("/updateboard", authverify.verifytoken,(req, res) => {
    query = `update board set boardid = "${req.user}${req.body.boarddate}${req.body.boardhead}", boardtext = "${req.body.boardtext}", boardhead = "${req.body.boardhead}", userid = "${req.user}", boarddate = "${req.body.boarddate}" WHERE boardid = "${req.body.boardid}" `

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "Upadte Complete",
            })
            console.log('Upadte complete')
        }
    });
})


module.exports = router;