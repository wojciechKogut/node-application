/** access from another file */
module.exports =  {
    ensureAuthenticated: function( req, res, next) {
        /** passport function */
        if(req.isAuthenticated()) {
            /** return next peace of middleware */
            return next();
        }

        req.flash("error_msg", "Not Authenticated");
        res.redirect("/users/login");
    }
}