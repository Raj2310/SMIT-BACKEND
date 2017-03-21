var express = require('express')
var router = express.Router();
let User=require('../utils/model/User.model')
let Airport=require('../utils/model/Airport.model')
let jwt=require('../utils/jwtAuth');
let services=require('../utils/services');
/*router.get('/addAirportData',(req,res)=>{
  services.readFile('./data_dump/airport.txt').then(function(airports) {
  console.log("Success!", airports.split("\n"));
  let a=airports.split("\n");
  a.shift();
  a.shift();
  const b=a.map((val)=>{
    const temp_arr=val.split("\t");
    let obj={};
    obj.city=temp_arr[0];
    let regExp = /\(([^)]+)\)/;
    let matches = regExp.exec(temp_arr[1]);
    obj.code=matches[1];
    obj.name=temp_arr[1];
    return obj;
  });
  Airport.insertMany(b, function(error, docs) {});
  res.send(b);
  }, function(error) {
    console.error("Failed!", error);
  })
});*/
module.exports = router