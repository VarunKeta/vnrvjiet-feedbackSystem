const express=require('express')
const testApp=express.Router()

testApp.use((req,res,next)=>{
    authorcollection=req.app.get('authorcollection')
    articlescollection=req.app.get('articlescollection')
    
    
    next()  
})


testApp.get('/testit',async(req,res)=>{
    let data=await articlescollection.find().toArray();
    console.log(data)
})


module.exports=testApp