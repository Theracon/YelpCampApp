var middlewareObj = {},
    Campground = require('../models/campground'),
    Comment = require('../models/comment');

// Middleware to check if a user has permission to edit, update, or destroy a campground
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash(
                    'error',
                    'Sorry, the campground you requested for was not found.',
                );
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Permission denied.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You must log in first.');
        res.render('login');
    }
};

// Middleware to check if a user has permission to edit, update, or destroy a comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash('error', 'Something went wrong.');
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Permission denied.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You must log in first.');
        res.render('login');
    }
};

// Middleware to check if a user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must log in first.');
    res.redirect('/login');
};

module.exports = middlewareObj;