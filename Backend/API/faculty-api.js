const exp = require('express');
const alumniApp = exp.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const verifyToken = require('../Middleware/verifyToken');
require('dotenv').config();

facultyApp.use(exp.json());

let facultyquestionscollection;
let usercollection;

alumniApp.use((req, res, next) => {
  facultyquestionscollection = req.app.get('facultyquestionscollection');
  usercollection = req.app.get('usercollection');
  next();
});

facultyApp.get('/form',verifyToken, expressAsyncHandler(async (req, res) => {
  try {
    const questionscollection = await createquestionscollection.find({title:"Alumni form"}).toArray();
    console.log(questionscollection)
    res.send({ message: 'alumni questions', payload: questionscollection});
  } catch (error) {
    console.error('Error fetching alumni questions:', error);
    res.status(500).send({ message: 'Error fetching alumni questions' });
  }
}));

facultyApp.post('/form',verifyToken, expressAsyncHandler(async (req, res) => {
  const { username, responses, comments, name, specialization, yearOfGraduation, city, state, pinCode, employmentEmail, company, designation } = req.body;

  // Hash the password before storing it
  //const hashedPassword = await bcrypt.hash(password, 10);

  const submission = {
    username,
    responses,
    comments,
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

facultyApp.get('/get-form',verifyToken, expressAsyncHandler(async (req, res) => {
  try {
      const form = await facultyquestionscollection.findOne({title:"Alumni form"});
      console.log(form)
      if (!form) {
          return res.status(404).json({ message: 'Form not found' });
      }
      // Include the ObjectId in the response
      res.status(200).json({ _id: form._id, title: form.title, questions: form.questions });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}));

const { ObjectId } = require('mongodb');

alumniApp.put('/update-form/:id', verifyToken, expressAsyncHandler(async (req, res) => {
  const formId = req.params.id;
  const { title, questions } = req.body;
  console.log(formId,title,questions)
  if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required.' });
  }

  // Preserve existing qid or generate new ones if missing
  const transformedQuestions = questions.map((q, index) => ({
      qid: q.qid !== undefined ? q.qid : index + 1,
      text: q.text,
      qtype: q.qtype,
      references: q.references || []
  }));

  try {
      const result = await createquestionscollection.updateOne(
          { _id:  new ObjectId(formId) },
          { $set: { title, questions: transformedQuestions, updatedAt: new Date() } }
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



module.exports = alumniApp;
