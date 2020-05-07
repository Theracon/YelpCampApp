// Assign dependencies
var express = require('express'),
    app = express(),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    uri =
    'mongodb+srv://yelpcamp:yelpcamp@yelpcampcluster-xmqfw.mongodb.net/YelpCamp?retryWrites=true&w=majority',
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    flash = require('connect-flash');

// Use connect-flash
app.use(flash());

// Require route files
var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

// Configure express-session
app.use(
    require('express-session')({
        secret: 'Home',
        resave: false,
        saveUninitialized: false,
    }),
);

// Configure passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect mongoose to the database (i.e. Atlas Cluster)
mongoose.connect(uri);

// use body-parser
app.use(bodyParser.urlencoded({ entended: true }));

// Give express permission to view the 'public' folder
app.use(express.static(__dirname + '/public'));

// Use method-override
app.use(methodOverride('_method'));

// Set view engine
app.set('view engine', 'ejs');

// Configure app to grab details of current signed-in user
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Seed the database
// seedDB();

// Configure express to use route files
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', indexRoutes);

// Listen port
app.listen(8080, function() {
    console.log('YelpCamp server is running...');
});