const exp=require('express')
const adminApp=exp.Router()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressAsyncHandler=require('express-async-handler')
const verifyToken = require('../Middleware/verifyToken')
// const verifyToken = require('../middleware/verifyToken')//imp
//get user collection app
require('dotenv').config()
adminApp.use(exp.json());
let userscollection;
let createquestionscollection;
adminApp.use((req,res,next)=>{
    userscollection=req.app.get('userscollection')
    createquestionscollection=req.app.get('createquestionscollection')
    next()
})
adminApp.post('/login', expressAsyncHandler(async (req, res) => {
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


//adding user by admin
adminApp.post('/adduser', verifyToken, expressAsyncHandler(async (req, res) => {
    const { username, usertype2, email } = req.body;
    
    // Check if the user already exists
    const existingUser = await userscollection.findOne({ username:username});
    if (existingUser) {
      return res.status(400).send({ message: 'Username already exists' });
    }
    
    await userscollection.insertOne({ username, userType2: usertype2,userType:"user", email });
    res.send({ message: 'User created' });
  }));
//update/edit user 
adminApp.put('/updateuser', verifyToken, expressAsyncHandler(async (req, res) => {
    const { username, usertype2, email } = req.body;
  
    // Check if the user exists
    const existingUser = await userscollection.findOne({ username });
    if (!existingUser) {
      return res.status(404).send({ message: 'User not found' });
    }
  
    // Update the user
    const updatedUser = {
      ...(usertype2 && { userType2: usertype2 }), // Only update if usertype2 is provided
      ...(email && { email }), // Only update if email is provided
    };
  
    await userscollection.updateOne({ username }, { $set: updatedUser });
  
    res.send({ message: 'User updated successfully' });
  }));

//retrive a user by username,usertype
adminApp.post('/retrieveuser',verifyToken,expressAsyncHandler(async(req,res)=>{
    const userCred=req.body;
    let dbUser=await userscollection.findOne({username:userCred.username})
    if (dbUser!=null){
        res.send({message:"User found",user:dbUser})
    }
    else{
        res.send({message:"User not found"})
    }
}))

//delete user by username
adminApp.delete('/deleteuser', verifyToken, expressAsyncHandler(async (req, res) => {
    const userToDelete = req.body;
    console.log('Delete user request:', userToDelete);

    let dbUser = await userscollection.findOne({ username: userToDelete.username });
    console.log('Database user found:', dbUser);

    if (dbUser != null) {
        await userscollection.deleteOne({ username: userToDelete.username });
        res.send({ message: "User deleted successfully" });
    } else {
        res.send({ message: "User not found" });
    }
}));



adminApp.post('/create-form', expressAsyncHandler(async (req, res) => {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Title and questions are required.' });
    }

  
    // Manually increment qid starting from 1 for each question in the form
    const transformedQuestions = questions.map((q, index) => ({
        qid: index + 1,  // Increment qid starting from 1
        text: q.text,
        qtype: q.qtype,
        references: q.references || []
    }));

    const form = {
        title,
        questions: transformedQuestions,
        createdAt: new Date()
    };

    await createquestionscollection.insertOne(form);
    res.status(201).json({ message: 'Form created successfully', payload: form });
}));


module.exports=adminApp;