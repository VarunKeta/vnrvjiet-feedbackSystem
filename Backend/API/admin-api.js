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
const multer = require('multer');
const bodyParser = require('body-parser');
const upload = multer();
adminApp.use(bodyParser.json());
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
    const { username, userType2, email } = req.body;
    console.log({ username, userType2, email }); // Log values to check
  
    // Check if the user already exists
    const existingUser = await userscollection.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: 'Username already exists' });
    }
  
    await userscollection.insertOne({ username, userType2, userType: "user", email });
    res.send({ message: 'User created' });
  }));
  
//update/edit user 
adminApp.put('/updateuser', verifyToken, expressAsyncHandler(async (req, res) => {
    const { username, userType2, email } = req.body;
  
    // Check if the user exists
    const existingUser = await userscollection.findOne({ username });
    if (!existingUser) {
      return res.status(404).send({ message: 'User not found' });
    }
  
    // Update the user
    const updatedUser = {
      ...(userType2 && { userType2 }), // Only update if userType2 is provided
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



adminApp.post('/create-form', verifyToken, expressAsyncHandler(async (req, res) => {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Title and questions are required.' });
    }

    // Check if a form with the same title already exists
    const existingForm = await createquestionscollection.findOne({ title });
    if (existingForm) {
        return res.status(400).json({ message: 'Form with this title already exists.' });
    }

    // Function to initialize the counts for each question type
    const initializeCounts = (qtype) => {
        switch (qtype) {
            case 1: // 1-5 options
            case 4: // excellent to poor (5 options)
                return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            case 2: // yes/no
                return { yes: 0, no: 0 };
            case 3: // comment type (no counts needed)
            default:
                return {};
        }
    };

    // Manually increment qid starting from 1 for each question in the form
    const transformedQuestions = questions.map((q, index) => ({
        qid: index + 1,  // Increment qid starting from 1
        text: q.text,
        qtype: q.qtype,
        references: q.references || [],
        counts: initializeCounts(q.qtype)
    }));

    const form = {
        title,
        questions: transformedQuestions,
        createdAt: new Date()
    };

    await createquestionscollection.insertOne(form);
    res.status(201).json({ message: 'Form created successfully', payload: form });
}));

const { ObjectId } = require('mongodb');

adminApp.put('/update-form', verifyToken, expressAsyncHandler(async (req, res) => {
    const { title, questions } = req.body;
    console.log(title, questions);

    if (!title || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Title and questions are required.' });
    }

    // Function to initialize the counts for each question type
    const initializeCounts = (qtype) => {
        switch (qtype) {
            case 1: // 1-5 options
            case 4: // excellent to poor (5 options)
                return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            case 2: // yes/no
                return { yes: 0, no: 0 };
            case 3: // comment type (no counts needed)
            default:
                return {};
        }
    };

    // Preserve existing qid or generate new ones if missing and initialize counts if needed
    const transformedQuestions = questions.map((q, index) => ({
        qid: q.qid !== undefined ? q.qid : index + 1,
        text: q.text,
        qtype: q.qtype,
        references: q.references || [],
        counts: q.counts !== undefined ? q.counts : initializeCounts(q.qtype)
    }));

    try {
        const result = await createquestionscollection.updateOne(
            { title: title },
            { $set: { questions: transformedQuestions, updatedAt: new Date() } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json({ message: 'Form updated successfully' });
    } catch (error) {
        console.error('Error updating form:', error.message);
        console.error('Stack Trace:', error.stack); // Log the stack trace
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}));
//delete form
adminApp.delete('/delete-form', expressAsyncHandler(async (req, res) => {
    const { title: formTitle } = req.body;

    try {
        const deletedForm = await createquestionscollection.findOneAndDelete({ title: formTitle });
        if (!deletedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json({ message: 'Form deleted successfully', deletedForm });
    } catch (error) {
        console.error('Error deleting form:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}));
  
adminApp.post('/send-email', upload.none(), async (req, res) => {
    const { email, username, password } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from:  process.env.EMAIL_USER,
        to: email,
        subject: 'Your Account Details',
        text: `Hello ${username},\n\nYour password is: ${password}\n\nBest regards,\nYour Company`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});

adminApp.post('/retrieve-form', verifyToken, expressAsyncHandler(async (req, res) => {
    const { title: formTitle } = req.body;

    try {
        const form = await createquestionscollection.findOne({ title: formTitle });
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json({ message: 'Form retrieved successfully', form });
    } catch (error) {
        console.error('Error retrieving form:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}));


module.exports=adminApp;