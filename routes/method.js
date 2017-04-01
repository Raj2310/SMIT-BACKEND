var express = require('express')
var router = express.Router();
let User=require('../utils/model/User.model')
let Airport=require('../utils/model/Airport.model')
let Flight=require('../utils/model/Flight.model');
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
/*router.get('/addFlights',(req,res)=>{
  const FlightNo=Math.ceil(services.getRandomArbitrary(100000,999999));
  const timeOfFlight=Math.ceil(services.getRandomArbitrary(0,23))+":"+Math.ceil(services.getRandomArbitrary(0,59));
  let source_ap={};
  let destination_ap={};
  Airport.findOne({}).skip(services.getRandomArbitrary(0,131)).exec((err,source_airport)=>{
    source_ap=source_airport;
    Airport.findOne({}).skip(services.getRandomArbitrary(0,131)).exec((err1,destination_airport)=>{
      destination_ap=destination_airport;
      if (source_ap._id==destination_ap._id) {
        res.send("Same source and destination");
      } else {
        const flightObj=new Flight({
          flightNumber:FlightNo,
          source:source_ap._id,
          destination:destination_ap._id,
          time:timeOfFlight
        });
        flightObj.save((err2,flight)=>{
          if (err2) {
            console.log(err2);
            res.send("Error");
          } else {
            res.send(flightObj);
          }
        })
        
      }
    })
  });
  
})*/
module.exports = router