const exp = require('express');
const graduateApp = exp.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const verifyToken = require('../Middleware/verifyToken');
require('dotenv').config();

graduateApp.use(exp.json());

let createquestionscollection;
let usercollection;

graduateApp.use((req, res, next) => {
 createquestionscollection = req.app.get('createquestionscollection');
 usercollection = req.app.get('usercollection');
  next();
});

graduateApp.post('/submit-institution-form', verifyToken, expressAsyncHandler(async (req, res) => {
  const {
      username, responses, comments} = req.body;

  const submission = {
      username,
      responses,
      comments,
      submittedAt: new Date()
  };

  try {
      const form = await createquestionscollection.findOne({ title: 'Graduate Exit form (Institution)' });

      if (!form) {
          return res.status(404).json({ message: 'Form not found' });
      }

      // Update counts based on responses
      const updatedQuestions = form.questions.map(question => {
          if (responses[question.qid] !== undefined) {
              const responseValue = responses[question.qid];
              
              switch (question.qtype) {
                  case 1: // 1-5 options
                  case 4: // excellent to poor (5 options)
                      if (!question.counts) {
                          question.counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                      }
                      question.counts[responseValue] = (question.counts[responseValue] || 0) + 1;
                      break;
                  case 2: // yes/no
                      if (!question.counts) {
                          question.counts = { yes: 0, no: 0 };
                      }
                      const yesNoOption = responseValue ? 'yes' : 'no';
                      question.counts[yesNoOption] = (question.counts[yesNoOption] || 0) + 1;
                      break;
                  case 3: // comment type (no count to update)
                      break;
                  default:
                      break;
              }
          }
          return question;
      });

      await createquestionscollection.updateOne(
          { title: 'Graduate Exit form (Institution)' },
          { $set: { questions: updatedQuestions } }
      );

      await usercollection.insertOne(submission);

      res.send({ message: 'Feedback submitted successfully', payload: submission });
  } catch (error) {
      console.error('Error submitting form:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}));


graduateApp.post('/submit-department-form', verifyToken, expressAsyncHandler(async (req, res) => {
  const { username, responses, comments, name, department, registrationno, email} = req.body;
  const submission = {
    username,
    responses,
    comments,
    name,
    department,
    registrationno,
    email,
    submittedAt: new Date()
  };

  try {
      const form = await createquestionscollection.findOne({ title: 'Graduate Exit form (Department)' });

      if (!form) {
          return res.status(404).json({ message: 'Form not found' });
      }

      // Update counts based on responses
      const updatedQuestions = form.questions.map(question => {
          if (responses[question.qid] !== undefined) {
              const responseValue = responses[question.qid];
              
              switch (question.qtype) {
                  case 1: // 1-5 options
                  case 4: // excellent to poor (5 options)
                      if (!question.counts) {
                          question.counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                      }
                      question.counts[responseValue] = (question.counts[responseValue] || 0) + 1;
                      break;
                  case 2: // yes/no
                      if (!question.counts) {
                          question.counts = { yes: 0, no: 0 };
                      }
                      const yesNoOption = responseValue ? 'yes' : 'no';
                      question.counts[yesNoOption] = (question.counts[yesNoOption] || 0) + 1;
                      break;
                  case 3: // comment type (no count to update)
                      break;
                  default:
                      break;
              }
          }
          return question;
      });

      await createquestionscollection.updateOne(
          { title: 'Graduate Exit form (Department)' },
          { $set: { questions: updatedQuestions } }
      );

      await usercollection.insertOne(submission);

      res.send({ message: 'Feedback submitted successfully', payload: submission });
  } catch (error) {
      console.error('Error submitting form:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}));
// question types:
// 1. 1-5 options
// 2. yes/no
// 3. comment type
// 4. excellent to poor (5 options)

graduateApp.get('/get-institution-form',verifyToken, expressAsyncHandler(async (req, res) => {
  try {
      const form = await createquestionscollection.findOne({title:"Graduate Exit form (Institution)"});
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
graduateApp.get('/get-department-form',verifyToken, expressAsyncHandler(async (req, res) => {
  try {
      const form = await createquestionscollection.findOne({title:"Graduate Exit form (Department)"});
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


graduateApp.get('/get-form-response-stats-institution', verifyToken, expressAsyncHandler(async (req, res) => {
  try {
    // Retrieve the form data
    const form = await createquestionscollection.findOne({ title: "Graduate Exit form (Institution)" });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const formStats = {
      title: form.title,
      questions: form.questions.map(question => ({
        qid: question.qid,
        text: question.text,
        qtype:question.qtype,
        counts: question.counts || {}
      }))
    };

    res.status(200).json(formStats);
  } catch (error) {
    console.error('Error fetching form response stats:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}));

graduateApp.get('/get-form-response-stats-department', verifyToken, expressAsyncHandler(async (req, res) => {
  try {
    // Retrieve the form data
    const form = await createquestionscollection.findOne({ title: "Graduate Exit form (Department)" });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const formStats = {
      title: form.title,
      questions: form.questions.map(question => ({
        qid: question.qid,
        text: question.text,
        qtype:question.qtype,
        counts: question.counts || {}
      }))
    };

    res.status(200).json(formStats);
  } catch (error) {
    console.error('Error fetching form response stats:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}));

module.exports = graduateApp;
