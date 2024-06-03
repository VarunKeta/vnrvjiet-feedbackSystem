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
userApp.use((req,res,next)=>{
    usercollection=req.app.get('usercollection')
    next()
})

//userlogin
userApp.post('/login',expressAsyncHandler(async(req,res)=>{
    const userCred=req.body;
    if(userCred.userType==="alumni"){
      const dbuser=await usercollection.findOne({alumni:{username:userCred.username}})
    //   const status=bcrypt.compare(userCred.password,dbuser.password)
      if(dbuser===null||userCred.password!==dbuser.password /*status===false*/){
            res.send({message:'Invalid Credentials'})
      }
      else{
            const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'30m'})
            res.send({message:'login success',token:signedToken,user:dbuser})
      }
    }
    //jwt token
}))

//alumini form
// userApp.get('/alumini-form',expressAsyncHandler(async(req,res)=>{

// }))
