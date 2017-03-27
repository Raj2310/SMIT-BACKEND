## List Of Api ##

+ /api : GET ,App running successfully

+ /api/login :  POST , Login , params: email,password

+ /api/register/:authKey/:name/:email/:password : GET , Registration

+ /api/getUser/:key : GET , Info of user using auth key

+ /api/generateBoardingPass : POST , Generate Boarding pass ,params: b_id(booking id),seat_no

+ /api/msgFrmServer : POST , Send push msg , params:b_id(booking id),msg

+ /api/booking/:bookingId : GET , Info of ticket booked 

+ /api/bookTicket/:flight/:user : GET , book a new ticket 

+ /api/userFlightsInfo/:Key : GET , List of bookings