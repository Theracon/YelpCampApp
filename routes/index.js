// Require all dependencies
var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// ROOT Route
router.get('/', function(req, res) {
    res.render('landing');
});

// AUTH ROUTES
// Sign Up Get Route - Displays the Sign Up form
router.get('/register', function(req, res) {
    res.render('register');
});

// Sign Up Post Route - Creates a new user and adds them to the database
router.post('/register', function(req, res) {
    User.register(
        new User({ username: req.body.username }),
        req.body.password,
        function(err, user) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/register');
            }
            passport.authenticate('local')(req, res, function() {
                req.flash('success', 'Welcome to Yelcamp, ' + user.username);
                res.redirect('/campgrounds');
            });
        },
    );
});

// Login GET Route - Displays the Login form
router.get('/login', function(req, res) {
    res.render('login');
});

// Login POST Route - Logs a user into the app
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
    }),
    function(req, res) {},
);

// Logout Route - Logs a user out of the app
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You logged out.');
    res.redirect('/campgrounds');
});

module.exports = router;