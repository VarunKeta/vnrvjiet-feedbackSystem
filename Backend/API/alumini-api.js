const exp = require('express');
const alumniApp = exp.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const verifyToken = require('../Middleware/verifyToken');
require('dotenv').config();

alumniApp.use(exp.json());

let alquestionscollection;
let usercollection;

alumniApp.use((req, res, next) => {
  alquestionscollection = req.app.get('alquestionscollection');
  usercollection = req.app.get('usercollection');
  next();
});

alumniApp.get('/form', expressAsyncHandler(async (req, res) => {
  let alquestions = await alquestionscollection.find().toArray();
  res.send({ message: 'alumni questions', payload: alquestions });
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
