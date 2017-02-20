var express = require('express')
var path = require('path')

var mongoose = require('mongoose')

var routes = require('./app/routes/index')

var companySchema = require('./app/models/companies')
var Company = mongoose.model('Company', companySchema)

var app = express()

var server = require('http').createServer(app)
var io = require('socket.io').listen(server)

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promise

app.use(express.static('./static'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'app/views'))

io.on('connection', function(socket){
	routes(app, io, socket)
	console.log('a user connected');
	socket.on('remove symbol', function(symbol) {
		Company.remove({'symbol': symbol}, function(err, doc) {
			if (err) console.log(err);
			socket.broadcast.emit('remove symbol', symbol)
		})
	})
});

server.listen(process.env.PORT||3000)

console.log('Server running on port 3000');



