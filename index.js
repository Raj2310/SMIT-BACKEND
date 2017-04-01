let express = require('express');
let app = express(); //init Express
let bodyParser = require('body-parser');
let router = express.Router();
let connection=require('./utils/dbConn.js');
var fbBot=require('./utils/fbBot');
var services=require('./utils/services');
var request = require('request')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'/*'http://localhost:3000'*/);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*'/*'X-Requested-With,content-type'*/);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.post('/webhook',fbBot.handleWebhook);
app.get('/test/:msg',(req,res)=>{
    const msg=req.params.msg;
    res.send(services.varifyMessage(msg));
})
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