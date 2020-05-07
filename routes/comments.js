// Require dependencies
var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware');

// NEW Route
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.error(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

// CREATE Route
router.post('/', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash('error', 'Something went wrong.');
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'You added a comment to ' + campground.name);
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(
    req,
    res,
) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {
                campground_id: req.params.id,
                comment: foundComment,
            });
        }
    });
});

// UPDATE Route
router.put('/:comment_id', middleware.checkCommentOwnership, function(
    req,
    res,
) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
        err,
        updatedComment,
    ) {
        if (err) {
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            req.flash('success', 'Comment updated.');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY Route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(
    req,
    res,
) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted.');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;