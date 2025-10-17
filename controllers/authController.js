const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const {signupSchema, signinSchema}  = require('../middlewares/validator');
const { hashPassword, comparePassword } = require('../utils/hashing');
const transporter = require('../utils/sendMail');
const { hmacProcess } = require('../utils/hashing');
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

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          return res.status(404).json({ success: false, message: 'User does not exist' });
        }
        if (existingUser.verified) {
          return res.status(400).json({ success: false, message: 'User is already verified' });
        }
        const codeValue = Math.floor(Math.random() * 1000000).toString();
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: existingUser.email,
            subject: 'Verification Code',
            text: `Your verification code is ${codeValue}`
        })
        if (info.accepted[0] == existingUser.email) {
            const hmacedCode = hmacProcess(codeValue, process.env.JWT_SECRET);
            existingUser.verificationCode = hmacedCode;
            existingUser.existingCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Verification code sent successfully', data: { code: hmacedCode } });
        }
        return res.status(500).json({ success: false, message: 'Failed to send verification code' });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
    }
};