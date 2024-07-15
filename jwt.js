const jwt = require("jsonwebtoken");
require('dotenv').config();
const jwtAuthMiddleware=(req,res,next)=>{

// first check the request headers has authorization or not 
const authorization=req.headers.authorization
if(!authorization){
  return res.status(401).json({ error: 'token not found' });
}




 // Extract the jwt token from the request  headers
 const token=req.headers.authorization.split(' ')[1];
 if(!token){
   return res.status(401).json({ error: 'Unauthorized' });
 }
 try {
    // Verify the JWT token
   const decoded= jwt.verify(token,process.env.JWT_SECRET);

    //Attach user information to the request object
    req.user =decoded;
    next();
 } catch (error) {
    console.log(error);
   return res.status(401).json({ error: 'Invalid token' });
 }
}

//function to genrate the token
const generateToken = (userData) => {
  // Genarate a new JWT token using data
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn:500000});
};

module.exports={jwtAuthMiddleware,generateToken}