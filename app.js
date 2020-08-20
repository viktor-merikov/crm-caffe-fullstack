const express = require("express");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const keys = require('./config/keys');
const passport = require('passport');
const app = express();

//connect to DB
mongoose.connect(keys.mongoURI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
}).then(() => console.log('Successfuly connected to MongoDB')).catch(err => console.log(err));

//passport js
app.use(passport.initialize());
require('./middleware/passport')(passport);

//cors
app.use(cors());

//morgan logger
app.use(morgan('dev'));

// direct access to images
app.use('/uploads', express.static('uploads'));

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//end points
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/dist/client'));
   app.get('*', (req, res) => {
      res.sendFile(
         path.resolve(
            __dirname, 'client', 'dist', 'client', 'index.html'
         )
      )
   });
}


module.exports = app;