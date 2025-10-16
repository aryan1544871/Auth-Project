const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const {signupSchema, signinSchema}  = require('../middlewares/validator');
const { hashPassword, comparePassword } = require('../utils/hashing');
exports.signup = async (req, res) => {   
  const { email, password } = req.body;
  try {
    const { error, value } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ success: false, message: 'User already exists' });
    }
    const hashedPassword = await hashPassword(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({ success: true, message: 'User created successfully', result });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
  }
  res.json({ message: 'User signed up successfully' });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({ success: false, message: error.details[0].message });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User does not exist' });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '18h' });
    res.cookie('Authorization', 'Bearer ' + token, { expires: new Date(Date.now() + 900000), httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      .json({ success: true, message: 'User signed in successfully', token });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
  }
};

exports.signout = (req, res) => {
  res.clearCookie('Authorization').status(200).json({ success: true, message: 'User signed out successfully' });
}