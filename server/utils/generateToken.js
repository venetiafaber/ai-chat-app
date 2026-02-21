import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                         // payload: data to encode in token
    process.env.JWT_SECRET,                 // secret key: to sign the token
    { expiresIn: process.env.JWT_EXPIRE }   // configuration: expiration, algorithim etc
  );
};

export default generateToken;