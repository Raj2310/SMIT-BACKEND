let express = require('express');
let app = express(); //init Express
let bodyParser = require('body-parser');
let router = express.Router();
let connection=require('./utils/dbConn.js');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let port = process.env.PORT || 5000;
//init Express Router
connection.connect();
const api=require('./routes/api');
const method=require('./routes/method');
//associate router to url path
app.use('/api', api);
app.use('/method',method);
//start the Express server
app.listen(port);
console.log('Listening on port ' + port);