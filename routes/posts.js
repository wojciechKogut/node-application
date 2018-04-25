const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const {ensureAuthenticated} = require("../helpers/auth");


module.exports = router;


/** load post model */
require("../models/Posts");
const Post = mongoose.model("posts");

router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("post/add");
});

/** add user */
router.post("/", (req, res) => {
    let err = [];

    if (req.body.title === "") err.push({ text: "Please enter title" });
    if (req.body.category === "") err.push({ text: "Please enter category" });
    if (req.body.content === "") err.push({ text: "Please enter content" })


    if (err.length > 0) {
        res.render("/add/", {
            errors: err,
            title: req.body.title,
            category: req.body.category,
            content: req.body.content
        });
    } else {
        const newPost = {
            title: req.body.title,
            category: req.body.category,
            content: req.body.content,
            id: req.body._id,
            user: req.user.id
        }
        new Post(newPost)
            .save()
            .then((post) => {
                req.flash("success_msg", "Post added");
                res.redirect("/post/view_posts");
            })

    }


});

/** view all posts */
router.get("/view_posts/", ensureAuthenticated, (req, res) => {
    /** find only users posts, not all */
    Post.find({user: req.user.id})
        .sort({ date: "desc" })
        .then(post => {
            res.render("post/view_posts", {
                post: post
            })
        })
});

/** edit post */
router.get("/edit/:id",ensureAuthenticated, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            res.render("post/edit", {
                post: post
            });
        });

});

/** update  post */
router.put("/:id", (req, res) => {

    Post.findOne({ _id: req.params.id })
        .then(post => {
            post.title = req.body.title,
                post.category = req.body.category,
                post.content = req.body.content

            post.save()
                .then(post => {
                    req.flash("success_msg", "Post successfuly updated");
                    res.redirect("/post/view_posts");
                })
        });

});


/** delete post */

router.delete("/:id", (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            post.remove()
                .then(() => {
                    req.flash("error_msg", "Post deleted");
                    res.redirect("/post/view_posts");
                })
        });
});