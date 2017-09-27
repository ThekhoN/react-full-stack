const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: { default: 0, type: Number }
});

mongoose.model('users', userSchema);
