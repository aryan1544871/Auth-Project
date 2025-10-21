const jwt = require('jsonwebtoken');
exports.identifier = (req, res, next) => {
    let token;
    if (req.headers.client === 'not-browser'){
        token = req.headers.authorization;
    }
    else{
        token = req.cookies['Authorization'];
    }
    if (!token) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    try{
    const userToken =  token.split(' ')[1];
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);  
    if (decoded){
        req.user = decoded;
        next();
    }
    }
    catch{
        throw new Error('error in the token');
    }
  };

