const express = require('express');
const router = express.Router();
const authverify = require('./middleware')
const cloudinary = require('cloudinary').v2;
const passwordHash = require('password-hash');
const mysql = require('mysql');


cloudinary.config({
    cloud_name: 'dd7cchy0p',
    api_key: '655572597652172',
    api_secret: process.env.API_SECRET
});




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





///Register New User
router.post("/insertuser", (req, res, next) => {
    query = `insert into user values("${req.body.userid}","${req.body.username}","${req.body.userlast}","${req.body.usersection}","${req.body.userpassword}","${req.body.userdepartment}","${req.body.userrole}","${req.body.usernumber}","${req.body.userprofile}")`
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
});


///Get All User
router.post("/getalluser", (req, res) => {
    query = `select * from user`
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            res.status(201).json({
                message: "Select Complete",
                data: results
            })
            console.log('select complete')
            console.log(results)
        }
    });
})

///Get User
router.post("/getuser", (req, res) => {
    query = `select * from user where userid="${req.body.userid}"`
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            if (results.length == 0) {
                res.status(200).json({
                    message: "notfound",
                    data: results,
                    status: 'invalid'
                })
            } else {
                res.status(200).json({
                    message: "found",
                    data: results,
                    status: 'valid'
                })
            }
            console.log('select complete')
            console.log(results)
        }
    });
})

//Update user work 
router.post('/updateuserwork', authverify.verifytoken, (req, res) => {
    query = `update userwork set userworkcal = "${req.body.userworkcal}", userworkdate = "${req.body.userworkdate}", userworkstarttime = "${req.body.userworkstarttime}", userworkdistance = "${req.body.userworkdistance}", userworktime = "${req.body.userworktime}", userworkpace = "${req.body.userworkpace}" where userid="${req.user}" and userworkdate="${req.body.userworkolddate}"`
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


//Update user profile
router.post('/updateprofile', authverify.verifytoken, (req, res) => {
    query = `update user set username = "${req.body.username}", userlastname = "${req.body.userlastname}", userdepartment = "${req.body.userdepartment}", usernumber = "${req.body.usernumber}", usersection = "${req.body.usersection}", userprofile = "${req.body.userprofile}" where userid="${req.user}"`
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


//Change user pw 
router.post('/changepw', authverify.verifytoken, (req, res) => {
    query = `select userpassword from user where userid="${req.user}"`
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {

            if (results.length == 0) {
                res.status(204).json({
                    message: "notfound",
                    status: 'not found user'
                })
            } else {
                if (passwordHash.verify(results[0].userpassword, req.body.oldpw)) {
                    query = `update user set userpassword = "${req.body.newpw}" where userid="${req.user}"`
                    connection.query(query, (err, results) => {
                        if (err) {
                            res.status(500).json({
                                message: "error"
                            })
                            console.log(err)
                        } else {
                            res.status(201).json({
                                message: "pwchange_success",
                                status:'valid'
                            })
                            console.log('update complete')
                            console.log(results)
                        }
                    });
                } else {
                    res.status(200).json({
                        message: "invalidpassword",
                        status: 'invalid'
                    })
                }

            }
            console.log('select complete')
            console.log(results)
        }
    });
})




//GET USER TOKEN
router.post('/getuserbytoken', authverify.verifytoken, async (req, res) => {
    query = `select username,userlastname,usersection,userdepartment,usernumber,userprofile from user where userid="${req.user}"`
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            if (results.length == 0) {
                res.status(200).json({
                    message: "notfound",
                    data: results,
                    status: 'invalid'
                })
            } else {
                res.status(200).json({
                    message: "found",
                    data: results,
                    status: 'valid'
                })
            }
            console.log('select complete')
            console.log(results)
        }
    });
})


//OCR RUNNING
router.post('/ocrrunning', async (req, res) => {
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.textDetection(req.body.url)
    // console.log(result)
    const detections = result.textAnnotations;
    let indexdate = 0
    let indexduration = 0
    let indexcal = 0
    let indexdistance = 0
    let indexpace = 0
    let indexstared = 0
    detections.forEach((text, index) => {
        switch (text.description) {
            case 'BE':
                indexdate = index - 1
                indexstared = index + 2
                break;
            case 'Running':
                indexdistance = index + 1
                indexduration = index + 2
                indexcal = index + 3
                break;
            case 'min/km':
                indexpace = index - 1
                break;
            default:
                break;
        }
        console.log(text.description, index)
    });
    console.log(detections[indexdate].description)
    let splitdate = detections[indexdate].description
    splitdate = splitdate.split('/')
    console.log(splitdate)
    let date_day, date_month, date_year, distance, time, pace, cal, starttime
    date_day = splitdate[0]
    date_month = splitdate[1]
    date_year = splitdate[2]
    distance = detections[indexdistance].description
    time = detections[indexduration].description
    pace = detections[indexpace].description
    cal = detections[indexcal].description
    starttime = detections[indexstared].description
    if (parseInt(date_month) < 10) {
        date_month = "0" + date_month
    }
    if (parseInt(date_day) < 10) {
        date_day = "0" + date_day
    }
    let temp = parseInt(date_year) - 543
    date_year = temp.toString()
    res.status(200).json({
        time: time,
        distance: distance,
        pace: pace,
        calorie: cal,
        starttime: starttime,
        day: date_day,
        month: date_month,
        year: date_year
    })
})


//OCR STRAVA
router.post('/ocrstrava', async (req, res) => {
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.textDetection(req.body.url)
    const detections = result.textAnnotations;
    let indexdate = 0
    let indexduration = 0
    let indexcal = 0
    let indexdistance = 0
    let indexpace = 0
    let indexstared = 0

    detections.forEach((text, index) => {
        console.log(text.description, index)
        switch (text.description) {
            case "Distance":
                indexdistance = index + 3
                break;
            case "Pace":
                indexpace = index + 3
                break;
            case "Time":
                indexduration = index + 3
                break;
            case "Cal":
                indexcal = index - 1
                break;
            default:
                break;
        }
    })

    let distance = detections[indexdistance].description
    let split_time = detections[indexduration].description.split(":")
    let time
    if (split_time.length == 2) {
        time = "0:" + detections[indexduration].description
    } else {
        time = detections[indexduration].description
    }
    let pace = detections[indexpace].description
    let cal = detections[indexcal].description
    let starttime = null
    let date_day = null, date_month = null, date_year = null

    res.status(200).json({
        distance: distance,
        time: time,
        pace: pace,
        calorie: cal,
        starttime: starttime,
        day: date_day,
        month: date_month,
        year: date_year
    })
})

//OCR SAMSUNG
router.post('/ocrsamsung', async (req, res) => {
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.textDetection(req.body.url)
    const detections = result.textAnnotations;
    let indexdate = 0
    let indexduration = 0
    let indexcal = 0
    let indexdistance = 0
    let indexpace = 0
    let indexstared = 0
    let date_day = null, date_month = null, date_year = null, distance, time, pace, cal, starttime = null

    detections.forEach((text, index) => {
        console.log(text.description, index)
        switch (text.description) {
            case "รายละเอียดการออกกำลังกาย":
                indexduration = index + 1
                break;
            case "ระยะเวลารวม":
                indexdistance = index + 1
                break;
            case "ระยะทาง":
                indexcal = index + 1
                break;
            case "ความเร็วสูงสุด":
                indexpace = index + 1
                break;
            default:
                break;
        }
    })

    time = detections[indexduration].description
    distance = detections[indexdistance].description
    cal = detections[indexcal].description
    pace = detections[indexpace].description
    pace = pace.replace("'", ":")
    pace = pace.replace('"', "")


    res.status(200).json({
        time: time,
        distance: distance,
        pace: pace,
        calorie: cal,
        starttime: starttime,
        day: date_day,
        month: date_month,
        year: date_year
    })
})


//OCR NIKE
router.post('/ocrnike', async (req, res) => {
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.textDetection(req.body.url)
    const detections = result.textAnnotations;
    let indexdate = 0
    let indexduration = 0
    let indexcal = 0
    let indexdistance = 0
    let indexpace = 0
    let indexstared = 0
    detections.forEach((text, index) => {
        switch (text.description) {
            case "กิโลเมตร":
                indexdistance = index - 1
                indexpace = index + 1
                indexduration = index + 2
                indexcal = index + 3
                break;
            case "-":
                indexstared = index + 1
                indexdate = index - 1
                break
            default:
                break;
        }
    })
    let date_day, date_month, date_year, distance, time, pace, cal, starttime
    if (detections[indexdate].description == 'วันนี้') {
        date_day = null
        date_month = null
        date_year = null
    } else {
        let splitdate = detections[indexdate].description.split('/')
        date_day = splitdate[0]
        date_month = splitdate[1]
        date_year = splitdate[2]

        if (parseInt(date_month) < 10) {
            date_month = "0" + date_month
        }
        if (parseInt(date_day) < 10) {
            date_day = "0" + date_day
        }
        date_year = (parseInt(date_year) + 2500) - 543
        date_year = date_year.toString()

    }

    split_time = detections[indexduration].description.split(":")
    if (split_time.length == 2) {
        time = "0:" + detections[indexduration].description
    }

    console.log(split_time.length)

    distance = detections[indexdistance].description
    pace = detections[indexpace].description
    cal = detections[indexcal].description
    starttime = detections[indexstared].description

    pace = pace.replace("'", ":")
    pace = pace.replace('"', "")

    res.status(200).json({
        time: time,
        distance: distance,
        pace: pace,
        calorie: cal,
        starttime: starttime,
        day: date_day,
        month: date_month,
        year: date_year
    })
})


///OCR Processing 3rd Party API ENDOMONDO
router.post("/ocruserwork", async (req, res) => {

    const vision = require('@google-cloud/vision');


    console.log(req.body.url)

    let distance
    let time
    let pace
    let cal
    let starttime
    let date_day, date_month, date_year

    const client = new vision.ImageAnnotatorClient();

    const [result] = await client.textDetection(req.body.url)
    console.log(result)
    const detections = result.textAnnotations;
    let currentindex_time
    let currentindex_distance
    let currentindex_pace
    let currentindex_cal
    let currentindex_starttime
    let currentindex_date_day, currentindex_date_month, currentindex_date_year

    detections.forEach((text, index) => {

        if (req.body.appselected == "Endomondo[ไทย]") {
            switch (text.description) {
                case "ระยะเวลา":
                    currentindex_time = index + 2
                    break;
                case "ระยะทาง":
                    currentindex_distance = index + 2
                    break;
                case "ฝีเท้าเฉลี่ย":
                    currentindex_pace = index + 2
                    break;
                case "แคลอรี่":
                    currentindex_cal = index + 1
                    break;
                default:
                    break;
            }
            if (text.description == "เดิน" || text.description == "วิ่ง") {
                currentindex_starttime = index + 5
                currentindex_date_day = index + 2
                currentindex_date_month = index + 3
                currentindex_date_year = index + 4
            }
            switch (index) {
                case currentindex_time:
                    time = text.description
                    break;
                case currentindex_distance:
                    distance = text.description
                    break;
                case currentindex_pace:
                    pace = text.description
                    break;
                case currentindex_cal:
                    cal = text.description
                    break;
                case currentindex_starttime:
                    starttime = text.description
                    break;
                case currentindex_date_day:
                    date_day = text.description
                    break;
                case currentindex_date_month:
                    date_month = text.description
                    break;
                case currentindex_date_year:
                    date_year = text.description
                    break;
                default:
                    break;
            }
        }

        if (req.body.appselected == "Endomondo[Eng]") {
            switch (text.description) {
                case "DURATION":
                    currentindex_time = index + 2
                    break;
                case "DISTANCE":
                    currentindex_distance = index + 2
                    break;
                case "PACE":
                    currentindex_pace = index + 1
                    break;
                case "CALORIES":
                    currentindex_cal = index + 2
                    break;
                default:
                    break;
            }
            if (text.description == "Running" || text.description == "Walking") {
                currentindex_starttime = index + 5
                currentindex_date_day = index + 2
                currentindex_date_month = index + 3
                currentindex_date_year = index + 4
            }
            switch (index) {
                case currentindex_time:
                    time = text.description
                    break;
                case currentindex_distance:
                    distance = text.description
                    break;
                case currentindex_pace:
                    pace = text.description
                    break;
                case currentindex_cal:
                    cal = text.description
                    break;
                case currentindex_starttime:
                    starttime = text.description
                    break;
                case currentindex_date_day:
                    date_day = text.description
                    break;
                case currentindex_date_month:
                    date_month = text.description
                    break;
                case currentindex_date_year:
                    date_year = text.description
                    break;
                default:
                    break;
            }
        }
    });

    switch (date_month) {
        case "ม.ค.":
            this.date_month = "01";
            break;
        case "ก.พ.":
            this.date_month = "02";
            break;
        case "มี.ค.":
            this.date_month = "03";
            break;
        case "เม.ย.":
            this.date_month = "04";
            break;
        case "พ.ค.":
            this.date_month = "05";
            break;
        case "มิ.ย.":
            this.date_month = "06";
            break;
        case "ก.ค.":
            this.date_month = "07";
            break;
        case "ส.ค.":
            this.date_month = "08";
            break;
        case "ก.ย.":
            this.date_month = "09";
            break;
        case "ต.ค.":
            this.date_month = "10";
            break;
        case "พ.ย.":
            this.date_month = "11";
            break;
        case "ธ.ค.":
            this.date_month = "12";
            break;
        default:
            break;
    }

    if (
        parseInt(date_day) < 10
    ) {
        this.date_day = "0" + this.date_day;
    }

    res.status(200).json({
        time: time,
        distance: distance,
        pace: pace,
        calorie: cal,
        starttime: starttime,
        day: date_day,
        month: date_month,
        year: date_year
    })
});




///Commit Work Data 
router.post("/commituserwork", authverify.verifytoken, async (req, res) => {
    ///check counter
    var counter;
    var insertdistance;
    var sum = 0;
    ///Counting user work
    query = `select count(userworkcounter) as workcounter from userwork where userid="${req.user}"`
    counter = connection.query(query, async (err, results) => {
        if (err) {
            res.status(500).json({
                message: "error"
            })
            console.log(err)
        } else {
            counter = results[0].workcounter;
            counter++;
            ///Check workevent
            query = `select eventdate,eventtype,eventvalue from event where eventdate="${req.body.userworkdate}"`
            connection.query(query, async (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: "error"
                    })
                    console.log(err)
                } else {
                    // Found event to executing
                    if (result.length != 0) {
                        sum = await eventcal(req.body.userworkdistance, result[0].eventtype, result[0].eventvalue);
                        //Insert to DB (CASE EVENT)
                        query = `insert into userwork values("${req.body.userworkdate}${req.user}${counter}","${req.body.userworkcal}","${req.user}","${req.body.userworkurl}","${req.body.userworkdate}","${counter}","${req.body.userworkstarttime}","${sum}","${req.body.userworktime}","${req.body.userworkpace}","${result[0].eventtype}","${req.body.userworkurlextra}")`
                        connection.query(query, (err) => {
                            if (err) {
                                res.status(500).json({
                                    message: "error"
                                })
                                console.log(err)
                            } else {
                                res.status(201).json({
                                    message: "Insert Complete"
                                })
                                console.log('insert complete')
                            }
                        });
                    }
                    // Not found event to executing
                    else {
                        //Insert to DB (CASE DEFAULT)
                        query = `insert into userwork values("${req.body.userworkdate}${req.user}${counter}","${req.body.userworkcal}","${req.user}","${req.body.userworkurl}","${req.body.userworkdate}","${counter}","${req.body.userworkstarttime}","${req.body.userworkdistance}","${req.body.userworktime}","${req.body.userworkpace}",${null},"${req.body.userworkurlextra}")`
                        connection.query(query, (err) => {
                            if (err) {
                                res.status(500).json({
                                    message: "error"
                                })
                                console.log(err)
                            } else {
                                res.status(201).json({
                                    message: "Insert Complete"
                                })
                                console.log('insert complete')
                            }
                        });
                    }
                }
            });
        }
    });
});



///Get All UserWork
router.post("/getuserallwork", authverify.verifytoken, (req, res) => {
    query = `select * from userwork where userid="${req.user}" order by userworkcounter`

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



///Get Userwork
router.post("/getuserwork", (req, res) => {
    query = `select * from userwork where workid="${req.body.userworkdate}${req.body.userid}"`

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

///Get Userwork By Id
router.post("/getuserworkbyid", (req, res) => {
    query = `select * from userwork where userid="${req.body.userid}" order by userworkcounter`

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


///Get Userwork By Token
router.post("/getuserworkbytoken", authverify.verifytoken, (req, res) => {
    query = `select * from userwork where userid="${req.user}" order by userworkcounter `

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

//Insert img to cloudinary
router.post("/insertimguser", async (req, res) => {

    await cloudinary.uploader.upload(req.body.file, function (error, result) {
        console.log(result, error)
        console.log(result.url)
        res.status(200).json({
            file: result.url
        })
    })

})









//cal event
eventcal = (distance, operation, value) => {
    var temp = -1;
    dis = parseFloat(distance)
    switch (operation) {
        case "M":
            temp = dis * value;
            break;
        case "P":
            temp = dis + (dis * value / 100);
            break;
        case "C":
            temp = value
            break;
        default:
            break;
    }
    return temp
}


module.exports = router;