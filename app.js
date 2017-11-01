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
var Game = require('./models/game')(mongoose);
var Shuffle = require('./libs/shuffle');
var bodyParser = require('body-parser');
app.set('views', './views');
app.set('view engine', 'pug');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var rooms = [];
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
	//console.log('user session:', req.session);
	Game.find(function(err, games) {
		console.log(games);
		res.render('index',{games: games});
	});
	
});

app.post('/', function(req, res) {
	//console.log(req.body.pn);
	//console.log(req.body.description);
	Game.create({playersNumber: req.body.pn, description: req.body.description}, function(err, game) {
		if(err) console.log(err);
		console.game("game", game);
		res.redirect('/');
	});
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
	//console.log('express session', req.session.pageUrl);
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


app.get('/game/:id', function(req, res) {
	req.session.pageUrl = '/page/'+req.params.id;
	res.render('game', {room:req.params.id});
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
  //console.log('socket.io session', socket.request.session);
  
  socket.on('join', room => {
	console.log('room', room.room);
	//socket.join(room);
  });
  socket.emit('enter', {mynews: "hello world"});

  socket.on('shuffle', cards => {
	  let shuffleCards = Shuffle(cards);
	  socket.emit('shuffled', {shuffleCards});
	  console.log('------------- shuffle-------');
  });

});

server.listen(8080, function() {
	console.log('Server is started and is listening port 8080');
});
