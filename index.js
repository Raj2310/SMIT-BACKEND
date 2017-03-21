let express = require('express');
let app = express(); //init Express
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let port = process.env.PORT || 5000;
//init Express Router
let router = express.Router();

const api=require('./routes/api');
//associate router to url path
app.use('/api', api)
//start the Express server
app.listen(port);
console.log('Listening on port ' + port);