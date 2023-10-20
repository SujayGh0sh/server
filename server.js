// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const morgan = require('morgan');
// const path = require('path');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 8005; // You can change the port number as needed

// // const upload = multer({ dest: 'upload/' });

// // app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//         origin: ['https://www.zeebanglamuktomancho.com'],  // Allow requests from this origin
//          credentials: true, // Allow credentials (e.g., cookies, authorization headers)
//        }));

       

//        const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//           cb(null, 'uploads/');
//         },
//         filename: function (req, file, cb) {
//           const extname = path.extname(file.originalname);
      
//           if (file.fieldname === 'aadharCard') {
//             const filename = file.fieldname + '-' + req.body.participantName + extname;
//             cb(null, filename);
//           } else if (file.fieldname === 'aadharCard1') {
//             const filename = file.fieldname + '-' + req.body.participantName + extname;
//             cb(null, filename);
//           } 
//            else {
//             cb(null, file.fieldname + '-' + Date.now() + extname);
//           }
//         },
//       });

//       const upload = multer({ storage: storage });

      

// // Connect to MongoDB (make sure MongoDB is running)
// mongoose.connect('mongodb+srv://sujayghoshcool:z1y2x3w4@cluster1.oppb2.mongodb.net/ZeeBanglaMuktoMancho?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Define a schema for your data
// const participantSchema = new mongoose.Schema({
//     name: String,
//     videoLink: String,
//     selectedCategory: String,
//     participantName: String,
//     forMyself: Boolean,
//     age: String,
//     gender: String,
//     aadharCard: String, 
//     forMyChild: Boolean,
//     childAge: String,
//     childGender: String,
//     parentName: String,
//     relationship: String, 
//     aadharCard1: String,
// });

// const Participant = mongoose.model('Participant', participantSchema);

// app.use('/uploads', express.static('uploads'));

// app.use(morgan('tiny'));

// // module.exports = Participant;

// // Middleware to parse JSON data
// app.use(bodyParser.json());

// // Create a new participant record
// app.post('/participants', upload.fields([
//   {name: 'aadharCard'},
//   {name: 'aadharCard1'},
// ]), async (req, res) => {

//   console.log('Uploaded file:', req.file);

//   const {
//     name,
//     videoLink,
//     selectedCategory,
//     participantName,
//     forMyself,
//     age,
//     gender,
//     forMyChild,
//     childAge,
//     childGender,
//     parentName,
//     relationship
//   } = req.body;

//   const aadharCardPath = req.files && req.files['aadharCard'] ? req.files['aadharCard'][0].path : '';
//         const aadharCardPath1 = req.files && req.files['aadharCard1'] ? req.files['aadharCard1'][0].path : '';

//   try {
//     const newParticipant = new Participant({
//       name,
//       videoLink,
//       selectedCategory,
//       participantName,
//       forMyself,
//       age,
//       gender,
//       forMyChild,
//       childAge,
//       childGender,
//       parentName,
//       relationship,
//       aadharCard: aadharCardPath,
//       aadharCard1: aadharCardPath1,
//       // Other fields...
//     });
//     const savedParticipant = await newParticipant.save();
//     res.status(201).json(savedParticipant);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to save participant' });
//   }
// });


// // Handle file uploads and save file paths in your route
// // app.post('/participants', upload.single('aadharCard'), upload.single('childAadharCard'), async (req, res) => {
// //     const {
// //       name,
// //       videoLink,
// //       selectedCategory,
// //       participantName,
// //       email,
// //       phoneNumber,
// //       address,
// //       forMyself,
// //       age,
// //       gender,
// //       forMyChild,
// //       childAge,
// //       childGender,
// //       parentName,
// //       relationship,
  
// //       // Get file paths from file objects
// //       aadharCard,
// //       childAadharCard
// //     } = req.body;
  
// //     try {
// //       // Save the file paths in the database
// //       const newParticipant = new Participant({
// //         name,
// //         videoLink,
// //         selectedCategory,
// //         participantName,
// //         email,
// //         phoneNumber,
// //         address,
// //         forMyself,
// //         age,
// //         gender,
// //         aadharCardPath: aadharCard ? aadharCard.path : null,
// //         forMyChild,
// //         childAge,
// //         childGender,
// //         parentName,
// //         relationship,
// //         childAadharCardPath: childAadharCard ? childAadharCard.path : null,
// //       });
  
// //       await newParticipant.save();
  
// //       res.status(201).json({ message: 'Participant data saved successfully' });
// //     } catch (err) {
// //       console.error('Error:', err);
// //       res.status(500).json({ error: 'Internal Server Error' });
// //     }
// //   });
  

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });








































const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const saltRounds = 12;
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const https = require('https');
const fs = require('fs');
const NodeCache = require('node-cache');
const cache = new NodeCache();

let temporaryOTP = null;

const app = express();
const port = 443;

// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/backend.zeebanglamuktomancho.com/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/backend.zeebanglamuktomancho.com/fullchain.pem'),
// };

app.get('/', async(req, res) => {
  res.send({message: 'Hello'});
});

app.use(cors({
  origin: ['https://www.zeebanglamuktomancho.com','http://localhost:3000'],  // Allow requests from this origin
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
}));

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'zeebanglamuktomancho@gmail.com',
    pass: 'ptdd dvms bwwm uugp', 
    // pass: 'Zeemancho'
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const extname = path.extname(file.originalname);
  
      if (file.fieldname === 'aadharCard') {
        const filename = file.fieldname + '-' + req.body.representation + extname;
        cb(null, filename);
      } else if (file.fieldname === 'aadharCard1') {
        const filename = file.fieldname + '-' + req.body.representation1 + extname;
        cb(null, filename);
      } else if (file.fieldname === 'registrationForm') {
        const filename = file.fieldname + '-' + req.body.name + extname;
        cb(null, filename);
      } else if (file.fieldname === 'aadharCard2') {
        const filename = file.fieldname + '-' + req.body.participantName + extname;
        cb(null, filename);
      } else if (file.fieldname === 'aadharCard3') {
        const filename = file.fieldname + '-' + req.body.participantName + extname;
        cb(null, filename);
      } else {
        cb(null, file.fieldname + '-' + Date.now() + extname);
      }
    },
  });

  const upload = multer({ storage: storage });

mongoose.connect("mongodb+srv://sujayghoshcool:z1y2x3w4@cluster1.oppb2.mongodb.net/ZeeBanglaMuktoMancho?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log(`Connection is successful`);
}).catch((err) => console.log(`Error connecting to MongoDB: ${err.message}`));

const userSchema = new mongoose.Schema({
    name: String,
    address: String,
    city: String,
    pinCode: String,
    representation: String,
    representation1: String,
    phoneNumber: String,
    phoneNumber1: String,
    email: String,
    regNumber: String,
    password: String,
    aadharCard: String,
    aadharCard1: String,
    registrationForm: String,
  });

  const User = mongoose.model('User', userSchema);

  const participantSchema = new mongoose.Schema({
        nameOfclub: String,
        videoLink: String,
        selectedCategory: String,
        participantName: String,
        forMyself: Boolean,
        age: String,
        gender: String,
        aadharCard2: String, 
        forMyChild: Boolean,
        childAge: String,
        childGender: String,
        parentName: String,
        relationship: String, 
        aadharCard3: String,
    });
  
    const Participant = mongoose.model('Participant', participantSchema);

app.use(bodyParser.json());

// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/uploads', express.static('uploads'));

app.use(morgan('tiny'));

app.disable('x-powered-by');

app.post('/register', upload.fields([
    { name: 'aadharCard' },
    { name: 'aadharCard1' },
    { name: 'registrationForm' }
  ]), async (req, res) => {
    const { name, address, city, pinCode, phoneNumber, phoneNumber1, regNumber, email, representation, representation1, pwd } = req.body;

    try {
        const existingUser = await User.findOne({ phoneNumber, phoneNumber1, email });
    
        if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
        }
    
        const hashedPassword = await bcrypt.hash(pwd, saltRounds);

        const aadharCardPath = req.files && req.files['aadharCard'] ? req.files['aadharCard'][0].path : '';
        const aadharCardPath1 = req.files && req.files['aadharCard1'] ? req.files['aadharCard1'][0].path : '';
        // const registrationFormPath = req.files && req.files['registrationForm'] ? req.files['registrationForm'][0].path : '';

        const newUser = new User({
            name,
            address,
            city,
            pinCode,
            representation,
            representation1,
            phoneNumber,
            phoneNumber1,
            regNumber,
            email,
            password: hashedPassword,
            aadharCard: aadharCardPath,
            aadharCard1: aadharCardPath1,
          });
      
          await newUser.save();
      
          res.status(201).json({ message: 'Registration successful' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Registration failed' });
        }
      });

      // var server = https.createServer(options, app);
      
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });

      // Middleware to verify JWT token
    const verifyToken = (req, res, next) => {
      const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {
        const decoded = jwt.verify(token, 'your-secret-key'); // Verify the token

        req.user = decoded; // Attach the decoded payload to the request object
        next(); // Move to the next middleware or endpoint handler
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    };


    app.post('/participants', upload.fields([
      { name: 'aadharCard2' },
      { name: 'aadharCard3' },
    ]), async (req, res) => {
      const {nameOfclub, videoLink, selectedCategory, participantName, forMyself, age, gender, forMyChild, childAge, childGender, parentName,relationship } = req.body;
    
      try {
        const aadharCardPath2 = req.files && req.files['aadharCard2'] ? req.files['aadharCard2'][0].path : '';
        const aadharCardPath3 = req.files && req.files['aadharCard3'] ? req.files['aadharCard3'][0].path : '';

        const newParticipant = new Participant({
                nameOfclub,
                videoLink,
                selectedCategory,
                participantName,
                forMyself,
                age,
                gender,
                forMyChild,
                childAge,
                childGender,
                parentName,
                relationship,
                aadharCard2: aadharCardPath2,
                aadharCard3: aadharCardPath3,
        });

        res.status(201).json({ message: 'Participation Registration successful' });
        await newParticipant.save();
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
      }
    });
    


      app.post('/profile/update-registration', verifyToken, upload.fields([
        { name: 'registrationForm' }
      ]), async (req, res) => {
        const { registrationForm } = req.body;

        const userId = req.user.userId;

        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        try{
          const registrationFormPath = req.files && req.files['registrationForm'] ? req.files['registrationForm'][0].path : '';

          const user = await User.findById(userId);

          if (!userId) {
            return res.status(404).json({ message: 'User not found' });
          }

          // 
          
          user.registrationForm = registrationFormPath;
          await user.save();

          // await newUser.save();
      
          res.status(201 || 200).json({ message: 'Registration successful' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Registration failed' });
        }
      });
        

     

     app.post('/login', async (req, res) => {
      const { email, pwd } = req.body;
    
      try {
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const passwordMatch = await bcrypt.compare(pwd, user.password);
    
        console.log('Stored Password (Hashed):', user.password);
        console.log('Provided Password:', pwd);
    
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Incorrect email or password' });
        }
        
        if (passwordMatch) {
          const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
          return res.status(200).json({ message: 'Login successful', token });
        }
        
        res.status(200).json({ message: 'Login successful' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
      }
    });

    app.post('/send-otp', async (req, res) => {
      const { email } = req.body;

      temporaryOTP = generateOTP();

      console.log('Temporary OTP:', temporaryOTP);

      res.header('Access-Control-Allow-Origin', 'https://www.zeebanglamuktomancho.com');
  res.header('Access-Control-Allow-Credentials', 'true');

    
      try {
        
        const otp = temporaryOTP;
    
        const mailOptions = {
          from: 'zeebanglamuktomancho@gmail.com',
          to: email, 
          subject: 'Zee Banlga OTP Verification',
          html: `To verify your Zee Bangla Mukto Mancho registration use this one time password (OTP): &nbsp;<span><b>${otp}</b></span>&nbsp; don not share it with anyone.`,
        };
        
    
     
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error); 
            return res.status(500).json({ message: 'Failed to send OTP' });
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'OTP sent successfully' });
          }
        });
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP' });
      }
    });
    
    app.post('/verify-otp', (req, res) => {
      const { otp } = req.body;

      console.log('Temporary OTP:', temporaryOTP);
    
      if (!temporaryOTP) {
        return res.status(400).json({ message: 'OTP expired or not generated' });
      }
    
      if (otp === temporaryOTP) {
        // OTP is valid, you can proceed with user registration
    
        // Clear the stored OTP after successful verification
        temporaryOTP = null;
    
        return res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        return res.status(401).json({ message: 'Invalid OTP' });
      }
    });

// app.listen(port, () => {
//         console.log(`Server is running on port ${port}`);
//  });