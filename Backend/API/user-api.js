const exp=require('express')
const userApp=exp.Router()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressAsyncHandler=require('express-async-handler')
// const verifyToken = require('../middleware/verifyToken')//imp
//get user collection app
require('dotenv').config()
userApp.use(exp.json());
let usercollection;
let userscollection;
userApp.use((req,res,next)=>{
    usercollection=req.app.get('usercollection')
    userscollection=req.app.get('userscollection')
    next()
})

//userlogin
userApp.post('/login', expressAsyncHandler(async (req, res) => {
  const userCred = req.body;
  console.log('Received login request:', userCred);
  const Password=await bcrypt.hash(userCred.password,6)
  console.log(Password)
  
  // Check for username
  const dbuser = await userscollection.findOne({ username: userCred.username });
  console.log('Database user found:', dbuser);
  
  if (dbuser === null || dbuser.userType!=userCred.userType) {
      res.send({ message: 'Invalid username or user type' });
  } else {
      if (!dbuser.password) {
          res.send({ message: 'Password not found for user' });
          console.log('Password not found for user:', dbuser.username);
      } else {
          // Compare password with the hashed password in database
          const isPasswordCorrect = await bcrypt.compare(userCred.password, dbuser.password);
          if (!isPasswordCorrect) {
              res.send({ message: 'Invalid password' });
              console.log('Invalid password');
          } else {
              // JWT token generation on successful login
              const signedToken = jwt.sign({ username: dbuser.username }, process.env.SECRET_KEY, { expiresIn: '1d' });
              res.send({
                  message: 'login success',
                  token: signedToken,
                  user: {
                      username: dbuser.username,
                      userType: dbuser.userType
                  }
              });
          }
      }
  }
}));
//get userType2-- from currentUser.username
userApp.post('/getusertype', expressAsyncHandler(async (req, res) => {
  const { username } = req.body;
  console.log(username)
  // Check if the username is provided
  if (!username) {
      return res.status(400).send({ message: "Username is required" });
  }

  // Fetch the user from the database
  const user = await userscollection.findOne({ username:username });
console.log(user)
  // Check if user exists
  if (!user) {
      return res.status(404).send({ message: "User not found" });
  }

  // Send the user type as response
  res.send({ payload: user.userType2 });
}));
//alumini form
// userApp.get('/alumini-form',expressAsyncHandler(async(req,res)=>{

// }))
module.exports=userApp;