const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

require("../models/User");
const User = mongoose.model("users");

/** export router to app */
module.exports = router;


router.get("/login", (req, res) => {
    res.render("users/login");
});

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", (req, res) => {

    let errors = [];


    if (req.body.name < 3) errors.push({ text: "Name should have at least 3 characters" });

    if (req.body.email === "") errors.push({ text: "Enter email" });

    if (req.body.password.length < 4) errors.push({ text: "Password should have at least 4 characters" });
    if(req.body.confirm === "") errors.push({ text: "Confirm password shouldn't be empty" });
    if (req.body.password !== req.body.confirm) errors.push({ text: "Passwrod do not match" });
    
    

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirm
    };

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            user: newUser
        });
    } else {

        /** check if user allready exists */

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash("error", "User allready exists");
                    res.redirect("/users/register");
                } else {
                    /** if no user exist, register */
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            new User(newUser)
                                .save()
                                .then(user => {
                                    req.flash("success_msg", "You are successfully registered. Now you can login");
                                    res.redirect("/users/login");
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                            })
                     });
                 })
             }

        });

    }


});

/** login form post */
router.post("/login", (req, res, next) => {
    /** 1 param -> name of strategy */
    passport.authenticate('local', {
        successRedirect: "/post/view_posts",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

/** logout */

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You were successfully logout");
    res.redirect("/");
});