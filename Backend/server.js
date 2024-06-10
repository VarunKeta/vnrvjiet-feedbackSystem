const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const path = require('path');
// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB server
const dbUrl = process.env.DB_URL ;

MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const feedbackDB = client.db('feedbackDB');
   /*const blogdb = client.db('blogdb');
   const articlescollection=blogdb.collection('articlescollection')
    app.set('articlescollection', articlescollection);*/
    const usercollection = feedbackDB.collection('usercollection');
    app.set('usercollection', usercollection);
    const alquestionscollection = feedbackDB.collection('alquestionscollection');
    app.set('alquestionscollection', alquestionscollection);
    const userscollection = feedbackDB.collection('userscollection');
    app.set('userscollection', userscollection);
    const createquestionscollection = feedbackDB.collection('createquestionscollection');
    app.set('createquestionscollection', createquestionscollection);
    console.log('DB connection successful');
  })
  .catch(err => console.error('Error in connecting to DB:', err));

// Middleware
app.use(express.json());

// Import routes
const userapp = require('./API/user-api');
const alumniapp = require('./API/alumini-api');
const adminApp = require('./API/admin-api');
//const testApp = require('./API/aa1');
// Use routes
app.use('/user-api', userapp);
app.use('/alumini-api', alumniapp);
app.use('/admin-api', adminApp);
//app.use('/aa1', testApp);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../fppro/build')));

// Handle any requests that don't match the above routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fppro/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Error', payload: err });
});

// Assign port number
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Web server running on port ${port}`));
