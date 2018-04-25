const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/** load user model */
const User = mongoose.model("users");

/** export function with strategy; passport passed from app.js */
module.exports = function(passport) {
    /**define local strategy */
    passport.use(new localStrategy({usernameField: "email"}, (email, password,done) => {
        /** check user */
        User.findOne({email: email})
            .then( (user) => {
                if(!user) {
                    return done(null, false, {message: "No user found"});
                } 
                
                /** match password */
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) console.log(err);
                    if(isMatch) {
                        return done(null, user);
                    } else return done(null, false, {message: "Incorect Password"});
                })
            })
            .catch(err => {
                console.log(err);
            })
            
    }));


    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });


} 