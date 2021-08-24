const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      try {
        const user = await User.findOne({email});
        if(!user) {
         return done(null, false, 'User not found');
        }

        const result = await user.checkPassword(password);
        if(!result) {
          return done(null, false, 'Wrong password');
        }

        return done(null, user);
      } catch(err) {
        return done(err);
      }
    },
);
