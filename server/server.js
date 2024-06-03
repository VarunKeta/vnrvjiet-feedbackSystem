//create exp app
const exp=require('express')
const app=exp()
require('dotenv').config()   //process.env.PORT
//deploy react build in this server
// const path=require('path')
// app.use(exp.static(path.join(__dirname,'../client/blogdb/build')))
const mc=require('mongodb').MongoClient
mc.connect(process.env.DB_URL)
.then(client=>{
const feedbackDB=client.db('feedbackDB')
const usercollection=feedbackDB.collection('usercollection')
app.set('usercollection',usercollection)
const admincollection=blogdb.collection('admincollection')
app.set('admincollection',admincollection)

console.log('db connnection success')
})
.catch(err=>console.log('err in connecting to db',err))
app.use(exp.json())
//if path starts with user-api send request to userapp
const userapp=require('./APIs/user-Api')
//if path starts with author-api send request to userapp
// const adminapp=require('./APIs/admin-Api')
app.use('/user-api',userapp)        
// app.use('/admin-api',adminapp)
//deals with page refresh
// app.use((req,res,next)=>{
//     res.sendFile(path.join(__dirname,'../client/blogdb/build/index.html'))
// })
app.use((err,req,res,next)=>{
    res.send({message:'error',payload:err})
})
const port=process.env.PORT;
app.listen(4000,()=>console.log(`web server in port ${port}`))