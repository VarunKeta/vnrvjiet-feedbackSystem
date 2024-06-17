const jwt=require('jsonwebtoken')
require('dotenv').config()
function verifyToken(req,res,next) {
  //get bearer token from headers request
  
  const bearerToken=req.headers.authorization
  console.log(bearerToken)
  //if bearer token not available
  if(!bearerToken){
    return res.send({message:"unauthorized access. plz login to continue"})
  }
  const token=bearerToken.split(' ')[1]
  try{
    jwt.verify(token,process.env.SECRET_KEY)
    next()
  }
  catch(err){
    next(err)
  }
}

module.exports= verifyToken