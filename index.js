const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User');
require('./services/passport');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);

const app = express();
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    keys: [keys.cookieKey] // array because it allows to randomly pick one key
  })
);
app.use(passport.initialize());
app.use(passport.session());
authRoutes(app); // authRoutes is a function that accepts app as arg
billingRoutes(app);

if (process.env.NODE_ENV === 'production') {
  // Express to serve up production assets by default ~ bundled js & css
  app.use(express.static('client/build'));

  // Express serve index.html for non-express handled routes
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log('app running on port: ', PORT);
});
