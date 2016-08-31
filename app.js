var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var passport = require('passport');
var passportLocal = require('passport-local').Strategy;
var mongoose = require('mongoose');
//var kitty = require('./models/kitty')(mongoose);
var User = require('./models/user')(mongoose);
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db', 'we are connected');
});

var sessionMiddleware = session({ secret: 'viter', 
	cookie: { 
		maxAge: 600000 
	},
	resave: false,
    saveUninitialized: true,
    store: new MongoStore({
    	mongooseConnection: mongoose.connection
    })
	});

passport.use(new passportLocal(
	function(username, password, done) {
		User.findOne({'email': username}, function(error, user) {
			if(error) { return done(error); }
			if (!user) {
        		return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
	));

passport.serializeUser(function(user, cb) {
  cb(null, user.email);
});

passport.deserializeUser(function(email, cb) {
  	User.findOne({'email': email}, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


/*
var murchyk = new kitty.Kitten({name: "Murchyk"});
murchyk.save();
console.log('murchyk', murchyk.name);
*/
// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }));

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware); 
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use("/public", express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	console.log('user session:', req.session);
	if (req.isAuthenticated()) {
		console.log('authenticated');
	} else {
		console.log('not authenticated');
	}
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', function(req, res) {
	res.sendFile(__dirname + '/public/login.html');
});

/*
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
*/

app.post('/login', function(req, res, next) {
	console.log('express session', req.session.pageUrl);
	passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
        if (!user) { return res.redirect('/login') }
        req.logIn(user, function(err) {
	    	if (err) { return next(err); }
	    	if(req.session.pageUrl)
	        	res.redirect(req.session.pageUrl);
	        else
	        	res.redirect('/');
	    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.get('/page', function(req, res) {
	req.session.pageUrl = '/page';
	if(req.isAuthenticated()) {
		res.sendFile(__dirname + '/public/page.html');
	} else {
		res.redirect('/login');
	}
});

app.get('/page1', function(req, res) {
	req.session.pageUrl = '/page1';
	if(req.isAuthenticated()) {
		res.sendFile(__dirname + '/public/page1.html');
	} else {
		res.redirect('/login');
	}
});

io.sockets.on("connection", function(socket) {
  console.log('socket.io session', socket.request.session);
});

server.listen(8080, function() {
	console.log('Server is started and is listening port 8080');
});