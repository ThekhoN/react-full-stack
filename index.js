const express = require('express');
require('./models/User');
require('./services/passport');
const authRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');

const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);

const app = express();
authRoutes(app);

const PORT = process.env.PORT || 5555;
app.listen(PORT);
