const functions = require('firebase-functions');
const express = require("express")
const cors = require("cors")
require('dotenv/config');
const mysql = require('mysql');
const app = express();
app.use(cors());
const auth = require('./api/authentication');
app.use('/auth', auth)
const userManage = require('./api/usermanage');
app.use('/usermanage', userManage)
const adminManage = require('./api/adminmanage');
app.use('/admin', adminManage)
app.get('/', (req, res) => {
    res.send('200')
})
exports.walkandrunapi = functions.https.onRequest(app)


