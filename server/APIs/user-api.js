const exp=require('express')
const userApp=exp.Router()
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const expressAsyncHandler=require('express-async-handler')
// const verifyToken = require('../middleware/verifyToken')

//userlogin
userApp.post('/login',expressAsyncHandler(async(req,res)=>{
    const userCred=req.body;
    let userTypeCollection;

    if(userCred.usertype==="alumni"){
      userTypeCollection=req.app.get('alumniCollection')
    }
    const dbUser=await userTypeCollection.findOne({username:userCred.username})
    // const status=bcrypt.compare(userCred.password,dbuser.password)
    if(dbUser===null||userCred.password!==dbUser.password /*status===false*/){
      res.send({message:'Invalid credentials'})
    }
    else{
      const signedToken=jwt.sign({username:dbUser.username},process.env.SECRET_KEY,{expiresIn:'30m'})
      res.send({message:'Login success',token:signedToken,user:dbUser})
    }  
}))

//alumini form
userApp.get('/alumni-form',expressAsyncHandler(async(req,res)=>{
  const alumniQuestions=req.app.get('alumniQuestions')
  const questions=await alumniQuestions.find().toArray()
  res.send({message:'Alumni Questions',payload:questions})
}))

//form submit
// userApp.post('/alumni-form')

module.exports=userApp