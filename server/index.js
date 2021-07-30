const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require('mysql');
require('dotenv/config');


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));


//MySQL DB connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'walkandrun'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution',  (error, results, fields)=> {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 

module.exports = connection;

//import postroutes
// const posts = require('./routes/api/posts');
// app.use('/api/post',posts);

// const register = require('./routes/api/register');
// app.use('/register',register);

const image = require('./routes/api/image');
app.use('/image',image)

const userM = require('./routes/api/usermanage');
app.use('/usermanage',userM)


const port = process.env.PORT || 5000;

app.listen(port,() => console.log(`Server started on port ${port}`));