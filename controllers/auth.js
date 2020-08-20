const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
   const candidate = await User.findOne({ email: req.body.email });
   if (candidate) {
      const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
      if (passwordResult) {
         const token = jwt.sign({
            email: candidate.email,
            userId: candidate._id
         }, keys.jwt, { expiresIn: 3600 });
         res.status(200).json({
            token: `Bearer ${token}`
         });
      } else {
         res.status(401).json({
            message: 'Wrong password'
         });
      }
   } else {
      res.status(404).json({
         message: 'User not found'
      });
   }
};

module.exports.register = async function (req, res) {
   const candidate = await User.findOne({ email: req.body.email });
   if (candidate) {
      res.status(409).json({
         message: 'Email already exist'
      });
   } else {
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(req.body.password, salt);
      const user = new User({
         email: req.body.email,
         password
      });
      try {
         await user.save();
         res.status(201).json(user);
      } catch (error) {
         errorHandler(res, error);
      }
   }
};