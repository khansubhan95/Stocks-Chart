var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var request = require('request')
var path = require('path')

var companySchema = require('../models/companies')
var Company = mongoose.model('Company', companySchema)

var urlencodedParser = bodyParser.urlencoded({extended:false})

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../../public', 'index.html'))
	})

	app.post('/', urlencodedParser, function(req, res) {
		var symbol = req.body.symbol.toUpperCase()
		console.log(symbol);

		var APIEndPoint = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol.toString() + '.json?api_key=' + process.env.QUANDL_KEY
		request.get(APIEndPoint, function(err, response, body) {
			if (!err && response.statusCode===200) {
				body = JSON.parse(body)
				console.log(typeof body);
				Company.findOne({symbol: symbol}, function(err, doc) {
					if (err) console.log(err);

					if (doc) res.redirect('/')

					else {
						var newCompany = new Company()

						newCompany.id = body.dataset.id
						newCompany.symbol = body.dataset.dataset_code
						newCompany.name = body.dataset.name
						newCompany.start_date = body.dataset.start_date
						newCompany.end_date = body.dataset.end_date
						newCompany.stocks = []
						for (var i = 0; i < body.dataset.data.length; i++) {
							newCompany.stocks.push([body.dataset.data[i][0], body.dataset.data[i][1]])
						}

						console.log(typeof newCompany);
						newCompany.save(function(err, doc) {
							if (err) console.log(err);
							res.redirect('/')
						})
					}
				})
			}
			else 
				res.redirect('/')
		})
		
	})
}