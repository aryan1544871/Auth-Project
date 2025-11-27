const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter');
const postRouter = require('./routers/postRouter');
const emailRouter = require('./routers/emailRouter');

app.use(cors({ origin: true, credentials: true }));

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/email', emailRouter);
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the server!, Aryan Kushwaha' });
});

const PORT = process.env.PORT || 3000;
mongoose.connect (process.env.MONGO_URI) .then ( result => {
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});     
}).catch(err => console.log(err)); 


