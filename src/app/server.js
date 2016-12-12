var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var RedirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var feedRouter = require('./routes/feed');
var rankRouter = require('./routes/rank');
var mongoose = require('mongoose');
var useragent = require('express-useragent');
var cors = require('cors');
var socketio = require('socket.io');

var io = socketio(app.listen(3000));

mongoose.Promise = global.Promise; // Ref: http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
mongoose.connect('mongodb://user:user@ds049466.mlab.com:49466/tinyurl');

app.use(cors());

app.use('/public',
    express.static(__dirname + '/public')
);

app.use('/node_modules',
    express.static(__dirname + '/node_modules')
);

app.use(useragent.express());

app.use('/api/v1', restRouter);

app.use('/auth', authRouter);

app.use('/feed', feedRouter); // TODO: should maybe integrate these into /api/v1

app.use('/rank', rankRouter); // TODO: should maybe integrate these into /api/v1

app.use('/:shortUrl', (new RedirectRouter(io)).router);
//colom means varaible after it

app.use('/', indexRouter);
