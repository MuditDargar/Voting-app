const express=require('express')
const app=express()
const db=require('./db')
 require('dotenv').config()

const bodyParser=require('body-parser');
app.use(bodyParser.json()) ; //req body

const port = process.env.port || 3000 ;

const {jwtAuthMiddleware}= require('./jwt');


// Import the routes files
const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');

//use the routers
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(port, () => {
        console.log(`listening on port 3000`)
    })