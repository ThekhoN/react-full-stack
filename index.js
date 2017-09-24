const express = require('express');
const authRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User');
require('./services/passport');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);

const app = express();
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
		keys: [keys.cookieKey] // array because it allows to randomly pick one key
	})
);
app.use(passport.initialize());
app.use(passport.session());
authRoutes(app); // authRoutes is a function that accepts app as arg

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
	console.log('app running on port: ', PORT);
});
