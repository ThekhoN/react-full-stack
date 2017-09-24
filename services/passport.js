const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ googleId: profile.id }).then(existingUser => {
				if (existingUser) {
					console.log('user already exists!');
					done(null, existingUser); // done(error, returningObject)
				} else {
					new User({
						googleId: profile.id
					})
						.save()
						.then(user => {
							done(null, user);
						});
				}
			});
			console.log('profile: ', profile);
		}
	)
);
