var express = require('express')
var path = require('path')

var mongoose = require('mongoose')

var routes = require('./app/routes/index')
var app = express()

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promise

app.use(express.static('./static'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'app/views'))

routes(app)

app.listen(process.env.PORT||3000)
console.log('Server running on port 3000');