const express = require("express");
const { async } = require("rxjs");
const jwt = require('jsonwebtoken');
const mongoose =require("mongoose");
const bcrypt = require('bcrypt');


const User =require("../../model/user.model")


mongoose.connect("mongodb+srv://mongodb:9410011857@cluster0.ubjhkbn.mongodb.net/?retryWrites=true&w=majority").then(
  console.log("Connected")
  ).catch(err=>{
    console.log(err)
  })

  const router = express.Router();


router.post('/signup', async (req, res, next) => {
  try {
    // Retrieve user details from the request body
    const { fullName, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate access token and refresh token
    const accessToken = jwt.sign({ email: savedUser.email }, 'yourAccessTonkenSecret', { expiresIn: '15m' });
    const refreshToken = jwt.sign({ email: savedUser.email }, 'yourRefreshTokenSecret', { expiresIn: '24h' });

    // Send the tokens as a response
    res.json({ accessToken, refreshToken });
    res.json({message:"success"})

    res.set('Content-Type', 'application/json');
    res.set('Custom-Header', 'Some value');
  } catch (error) {
        res.sendStatus(500);
    console.log(error)
  }
});



router.post('/login',async (req,res,next)=>{
  try {
 // Retrieve user details from the request body
 const { email, password } = req.body;

 // Find the user in the database based on the provided email
 const user = await User.findOne({ email });
 if (!user) {
   return res.status(401).json({ message: 'Invalid email or password' });
 }

 // Compare the hashed password with the provided password using bcrypt
 const isPasswordValid = await bcrypt.compare(password, user.password);
 if (!isPasswordValid) {
   return res.status(401).json({ message: 'Invalid email or password' });
 }


 // Generate access token and refresh token
 const accessToken = jwt.sign({ email: user.email }, 'yourAccessTokenSecret', { expiresIn: '15m' });
 const refreshToken = jwt.sign({ email: user.email }, 'yourRefreshTokenSecret', { expiresIn: '24h' });
 // Send the tokens as a response
 res.json({ accessToken, refreshToken });
 res.set('Content-Type', 'application/json');
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
