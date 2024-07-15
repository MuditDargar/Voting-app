const express=require('express');
const router=express.Router();
const User = require('../models/user') // Import the Person model
const {jwtAuthMiddleware,generateToken}=require('./../jwt');

router.post('/signup' , async (req, res) => {
    try {
      const data = req.body;  //Assuming the request body contains the person data
      
      // check if an admin already exists 
       if(data.role==='admin'){
        const admin=await User.findOne({role:'admin'});
        if(admin){
            return res.status(400).json({ error: 'Admin already exists' });
        }
       }
        // Create a new User document using the Mongoose model
      const newUser = new User(data);  // by this you can pass all at one time
      // Save the new User document to the database
      const response = await newUser.save();
 console.log('data saved');

    const payload={
      id:response.id 
      
    }
    console.log(JSON.stringify(payload))
 const token=generateToken(payload);
console.log("Token is :",token);
  res.status(200).json({response:response , token: token }); // Send the newly created person document back to the client
 // Send only the response without the extra string
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// login route
router.post('/login',async(req,res)=>{
 try {
  // Extract the username and password from request body
  const {aadharCardNumber,password}=req.body;

  //Find the user by aadharCardNumber
  const user= await User.findOne({aadharCardNumber:aadharCardNumber}) ;

// If user does not exist or password does not match ,return error
if(!user || !(await user.comparePassword(password))){
  return res.status(401).json({ error: 'Invalid username or password ' });
}
 // generate token
 const payload={
  id:user.id ,
 
 }
 const token=generateToken(payload);

//return token as response
res.json({token})

 } catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Internal server error' });
 }
})

//profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
 try{
  const userData=req.user;
  const userid=userData.id;
  const user=await Person.findById(userid);
  res.status(200).json({user});
 }
 catch(error){
console.log(error);
res.status(500).json({ error: 'Internal Server Error' });
 }
})

router.put('/profile/password', jwtAuthMiddleware ,async (req, res) => {
  try{
    const userid=req.params.user.id; // Extract the id from the URL parameter
   const {currentPassword ,newPassword}=req.body ; //Extract the current password and new password from request body
    

   // Find the User by userId
   const user= await User.findById(userid);
   
//If password does not match,return error
if(!(await user.comparePassword(currentPassword))){
  return res.status(401).json({ error: 'Invalid current password' });
}
//Update the User password
user.password=newPassword;
await user.save();

    console.log('Password updated successfully of User');
    res.status(200).json({message:"Password updated"});

  }catch(err){
 console.log(err);
  res.status(500).json({ error: 'Internal server error' });
  }
})



module.exports = router;
  
  
  