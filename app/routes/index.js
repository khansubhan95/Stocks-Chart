var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var request = require('request')

var urlencodedParser = bodyParser.urlencoded({extended:false})

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('list')
	})

	app.post('/', urlencodedParser, function(req, res) {
		var symbol = req.body.symbol.toUpperCase()
		console.log(symbol);
		var APIEndPoint = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol.toString() + '.json?api_key=' + process.env.QUANDL_KEY
		console.log(APIEndPoint);
		request.get(APIEndPoint, function(err, response, body) {
			if (!err && response.statusCode===200) {
				body = JSON.parse(body)
				console.log(typeof body);
				var data = {}
				data.id = body.dataset.id
				data.symbol = body.dataset.dataset_code
				data.name = body.dataset.name
				data.start_date = body.dataset.start_date
				data.end_date = body.dataset.end_date
				res.send(body.dataset.id)
			}
		})
	})
}