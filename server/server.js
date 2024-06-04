//create exp app
const exp=require('express')
const app=exp()
require('dotenv').config()   
//deploy react build in this server
// const path=require('path')
// app.use(exp.static(path.join(__dirname,'../client/blogdb/build')))
//if path starts with user-api send request to userapp
const userApp=require('./APIs/user-api')
const mc=require('mongodb').MongoClient
mc.connect(process.env.DB_URL)
.then(client=>{
const feedbackDB=client.db('feedbackDB')
const alumniCollection=feedbackDB.collection('alumniCollection')
app.set('alumniCollection',alumniCollection)
const alumniQuestions=feedbackDB.collection('alumniQuestions')
app.set('alumniQuestions',alumniQuestions)
console.log('DB connnection success')
})
.catch(err=>console.log('Err in connecting to db',err))
app.use(exp.json())
app.use('/user-api',userApp)    
//deals with page refresh
// app.use((req,res,next)=>{    
//     res.sendFile(path.join(__dirname,'../client/blogdb/build/index.html'))
// })
app.use((err,req,res,next)=>{
    res.send({message:'Error',payload:err.message})
})
const port=process.env.PORT;
app.listen(port,()=>console.log(`web server in port ${port}`))