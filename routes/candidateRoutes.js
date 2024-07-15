const express=require('express');
const router=express.Router();
const User = require('../models/user') // Import the Candidate model
const {jwtAuthMiddleware,generateToken}=require('./../jwt');
const Candidate = require('../models/candidate')

const checkAdminRole=async (userID)=>{
    try{
        const user=await User.findById(userID);
        if(user.role==="admin"){
            return true
        }
    
    }
    catch(err){

        return false
    }
}





//PoST route to add the candidate
router.post('/' ,jwtAuthMiddleware , async (req, res) => {
    try {
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({ message:'user does not have admin role' });
        }
       
      const data = req.body;  //Assuming the request body contains the Candidate data
       // Create a new Candidate document using the Mongoose model
      const newCandidate = new Candidate(data);  // by this you can pass all at one time
      // Save the new Candidate document to the database
      const response = await newCandidate.save();
 console.log('data saved');

res.status(200).json({response:response }); // Send the newly created person document back to the client
 // Send only the response without the extra string
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });






router.put('/:candidateID' ,jwtAuthMiddleware,async (req, res) => {
    if(!checkAdminRole(req.user.id)){
        return res.status(403).json({ message:'user does not have admin role' });
    }
  try{
    const id=req.params.candidateID; // Extract the id from the URL parameter
    const updateCandidatedata=req.body; //Updated data for person
    
    const response=await Candidate.findByIdAndUpdate(id,updateCandidatedata,{
      new:true, // Return the updated document
      runValidators:true ,// Validate the updated data
    })
    if(!response){
     return  res.status(404).json({ error: 'Candidate not found' });
    }
    console.log('Candidate data updated successfully');
    res.status(200).json(response);


  }catch(err){
 console.log(err);
  res.status(500).json({ error: 'Internal server error' });
  }
})


router.delete('/:candidateID',jwtAuthMiddleware ,async (req, res) => {
    if(!checkAdminRole(req.user.id)){
        return res.status(403).json({ message:'user does not have admin role' });
    }
  try{
    const id=req.params.candidateID; // Extract the id from the URL parameter

    
    const response=await Candidate.findByIdAndDelete(id)
    if(!response){
     return  res.status(404).json({ error: 'Candidate not found' });
    }
    console.log('Candidate delete successfully');
    res.status(200).json(response);


  }catch(err){
 console.log(err);
  res.status(500).json({ error: 'Internal server error' });
  }
})



//lets start voting 
router.post('/vote/:candidateID',jwtAuthMiddleware ,async (req, res) => {
    // no admin vote
    // user can only give the vote one time
    if(!checkAdminRole(req.user.id)){
        return res.status(403).json({ message:'user does not have admin role' });
    }
    candidateID=req.params.candidateID;
    userID=req.user.id
try{
// FInd the Candidate document with the specified candidateID
  const candidate=await Candidate.findById(candidateID);

  if(!candidate){
    return res.status(404).json({ error: 'Candidate not found' });
  }

  // Find the User document with the specified userID
  const user= await User.findById(userID)

  if(!user){
    return res.status(404).json({ error: 'User not found' });
  }
  // Check if the user has already voted
  if(user.isVoted){
    return res.status(400).json({ error: 'You have already voted' });
  }
  if(user.role=='admin'){
    return res.status(400).json({ error: 'Admin is  not allowed to vote' });
  }
//Update the Candidate document to record the vote
  candidate.votes.push({user:userID})
  candidate.voteCount++;
 await  candidate.save();

//Update the User document to record the vote
  user.isVoted=true;
  await user.save();

  res.status(200).json({message:'vote recorded successfully'});
}
  catch(err){
 console.log(err);
  res.status(500).json({ error: 'Internal server error' });
  }
})

//vote count 
router.get('/vote/Count' ,async (req, res) => {
    try{
    const candidates=await Candidate.find().sort({voteCount:'descending'});

    // Map the candidates to only return their name and votecount
    const voterecord = candidates.map(data => ({
      party: data.party,
      voteCount:data.voteCount
    }));
   return  res.status(200).json(voterecord);
  }catch(err){
 console.log(err);
  res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/candidates', async (req, res) => {
    try {
      const candidates = await Candidate.find({}, 'name age'); // Fetch only name and age of candidates
      res.status(200).json(candidates); // Send the list of candidates to the client
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
  
  
  