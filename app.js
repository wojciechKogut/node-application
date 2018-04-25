/** include express  */
const express = require("express");
/** Handlebars view engines for Express */
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const posts = require("./routes/posts");
const users = require("./routes/users");
const passport = require("passport");

/** db config */
const db = require("./config/database");

/** passport config; pass passport as parameter to config/passport.js */
require("./config/passport")(passport);

/** connect to mongoose */
mongoose.connect(db.mongoURI)
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));

/** load post model */
require("./models/Posts");
const Post = mongoose.model("posts");

const port = process.env.PORT || 5000;

/** init  */
const app = express();


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use("/", (req, res, next) => {
    req.name = "Some title";
    next();
})


/** body parser middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** method override middleware */
app.use(methodOverride("_method"));


/** express session middleware */
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

/** passport middleware */
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

/** global variables */
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    /** after login save user data in global variable */
    res.locals.user = req.user || null;
    next();

});


app.get("/", (req, res) => {
    const title = req.name;

    /** pass params to view */
    res.render("home", {
        title: title
    });
});


app.get("/about", (req, res) => {
    res.render("about");
});


/** connect posts route module with app, */
app.use("/post", posts);
app.use("/users", users);



app.listen(port);