const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const fs = require('fs');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const path = require('path');
// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());
// Connect to MongoDB server
const dbUrl = process.env.DB_URL ;

MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const feedbackDB = client.db('feedbackDB');
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
const graduateApp = require('./API/graduate-api');
const facultyApp = require('./API/faculty-api');
const parentApp = require('./API/parent-api');
const studentApp = require('./API/student-api');
const industryApp = require('./API/industry-api');
const professionalApp = require('./API/professional-api');
//const testApp = require('./API/aa1');
// Use routes
app.use('/user-api', userapp);
app.use('/alumini-api', alumniapp);
app.use('/admin-api', adminApp);
app.use('/faculty-api', facultyApp);
app.use('/graduate-api', graduateApp);
app.use('/student-api', studentApp);
app.use('/parent-api', parentApp);
app.use('/industry-api', industryApp);
app.use('/professional-api', professionalApp);
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
// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const sendEmail = async (email, file) => {
  try {
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });

      const mailOptions = {
          from: 'aashritharaj26@gmail.com',
          to: email,
          subject: 'File Upload Confirmation',
          html: `
              <h1>File Upload Confirmation</h1>
              <p>Thank you for uploading your file.</p>
          `,
          attachments: [
              {
                  filename: file.originalname,
                  path: file.path,
              },
          ],
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
      throw error;
  }
};

app.post('/send-email', upload.single('file'), async (req, res) => {
  const { email } = req.body;
  const file = req.file;

  if (!email || !file) {
      return res.status(400).send('Email and file are required.');
  }

  try {
      await sendEmail(email, file);
      res.status(200).send('Email sent successfully.');
  } catch (error) {
    console.log(error)
      res.status(500).send('Failed to send email.');
  }
});



// Assign port number
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Web server running on port ${port}`));
