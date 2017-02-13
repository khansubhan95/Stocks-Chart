var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var request = require('request')

var urlencodedParser = bodyParser.urlencoded({extended:false})

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('list')
	})
}