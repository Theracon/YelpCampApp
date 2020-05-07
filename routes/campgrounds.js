// Require all dependencies
var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware');

// INDEX (GET) Route - Displays all campgounds
router.get('/', function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.error(err);
        } else {
            res.render('campgrounds/index', {
                campgrounds: campgrounds,
            });
        }
    });
});

// NEW (POST) ROUTE - Shows form to create a new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

// CREATE (POST) ROUTE - Creates a new campground and adds it to the database
router.post('/', middleware.isLoggedIn, function(req, res) {
    var newCampground = {};
    newCampground.name = req.body.name;
    newCampground.image = req.body.image;
    newCampground.description = req.body.description;
    newCampground.author = {
        id: req.user._id,
        username: req.user.username,
    };
    Campground.create(newCampground, function(err, createdCampground) {
        if (err) {
            console.error(err);
        } else {
            console.log(createdCampground);
            res.redirect('/campgrounds');
        }
    });
});

// SHOW (GET) ROUTE - Shows more information about any selected campground
router.get('/:id', function(req, res) {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function(err, foundCampground) {
            if (err) {
                console.error(err);
            } else {
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
});

// EDIT (GET) Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(
    req,
    res,
) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

// UPDATE (PUT) Route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        updatedCampground,
    ) {
        if (err) {
            req.flash('error', 'Something went wrong.');
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground updated.');
            res.redirect('/campgrounds/' + updatedCampground._id);
        }
    });
});

// DESTROY (DELETE) ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash('error', 'Something went wrong.');
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground removed.');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;