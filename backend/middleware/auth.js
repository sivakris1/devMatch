import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const auth = async(req,res,next) => {
    try {
        const authHeader = req.header('Authorization');

        if(!authHeader || !authHeader.startsWith('Bearer ')){
           return res.status(401).json({ message: 'No token, authorization denied' });
        }
        
        const token = authHeader.substring(7);

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Token verification failed' });
    }
  }
}

export default auth;