const exp = require('express');
const alumniApp = exp.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const verifyToken = require('../Middleware/verifyToken');
require('dotenv').config();

alumniApp.use(exp.json());

let createquestionscollection;
let usercollection;

alumniApp.use((req, res, next) => {
  createquestionscollection = req.app.get('createquestionscollection');
  usercollection = req.app.get('usercollection');
  next();
});

alumniApp.get('/form', expressAsyncHandler(async (req, res) => {
  try {
    const questionscollection = await createquestionscollection.find().toArray();
    console.log(questionscollection)
    res.send({ message: 'alumni questions', payload: questionscollection});
  } catch (error) {
    console.error('Error fetching alumni questions:', error);
    res.status(500).send({ message: 'Error fetching alumni questions' });
  }
}));

alumniApp.post('/form', expressAsyncHandler(async (req, res) => {
  const { username, responses, comments, name, specialization, yearOfGraduation, city, state, pinCode, employmentEmail, company, designation } = req.body;

  // Hash the password before storing it
  //const hashedPassword = await bcrypt.hash(password, 10);

  const submission = {
    username,
    responses,
    comments,
    name,
    specialization,
    yearOfGraduation,
    mailingAddress: {
      city,
      state,
      pinCode
    },
    employmentDetails: {
      email: employmentEmail,
      company,
      designation
    },
    submittedAt: new Date()
  };

  await usercollection.insertOne(submission);
  res.send({ message: 'Feedback submitted successfully', payload: submission });
}));

// question types:
// 1. 1-5 options
// 2. yes/no
// 3. comment type
// 4. excellent to poor (5 options)


module.exports = alumniApp;
