var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var request = require('request')
var path = require('path')

var companySchema = require('../models/companies')
var Company = mongoose.model('Company', companySchema)

var urlencodedParser = bodyParser.urlencoded({extended:false})

module.exports = function(app, io) {
	app.get('/', function(req, res) {
		Company.find({}, function(err, doc) {
			if (err) console.log(err);

			if(doc) {
				var data = doc
				res.render('list', {'data': data})
			}

			else {
				res.render('list')
			}
		})
	})

	app.get('/api/stocks/:name', function(req, res) {
		var dateRaw = new Date()
	    var date = (dateRaw.getUTCFullYear()-1).toString() + '-' + dateFormat(dateRaw.getMonth()+1) + '-' + dateFormat(dateRaw.getMonth())

	    var name = req.params.name

	    var APIEndPoint = 'https://www.quandl.com/api/v3/datasets/WIKI/' + name.toString() + '.json?column_index=1&start_date=' + date + '&api_key=JaJF5_8_KE2R6XNom8ux'

	    // request.get(APIEndPoint, function(err, response, body) {
	    // 	if (!err && response.statusCode===200) {
	    // 		body = JSON.parse(body)
	    // 		res.send(body)
	    // 	}
	    // 	else
	    // 		res.redirect('/')
	    // })
	    
	    Company.findOne({'symbol': name}, function(err, doc) {
	    	if (err) console.log(err);
	    	// console.log(doc.dataset.id);
	    	res.send(doc)
	    })
	})

	app.post('/', urlencodedParser, function(req, res) {
		var symbol = req.body.symbol.toUpperCase()

		// var APIEndPoint = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol.toString() + '.json?api_key=' + process.env.QUANDL_KEY
		
		var dateRaw = new Date()
	    var date = (dateRaw.getUTCFullYear()-1).toString() + '-' + dateFormat(dateRaw.getMonth()+1) + '-' + dateFormat(dateRaw.getMonth())
	    var APIEndPoint = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol.toString() + '.json?column_index=1&start_date=' + date + '&api_key=JaJF5_8_KE2R6XNom8ux'

		request.get(APIEndPoint, function(err, response, body) {
			if (!err && response.statusCode===200) {
				body = JSON.parse(body)
				Company.findOne({symbol: symbol}, function(err, doc) {
					if (err) console.log(err);

					if (doc) res.send({})

					else {
						var newCompany = new Company()

						newCompany.id = body.dataset.id
						newCompany.symbol = body.dataset.dataset_code
						newCompany.name = body.dataset.name.split('Prices')[0]
						for (var i = 0; i < body.dataset.data.length; i++) {
							newCompany.stocks.push([body.dataset.data[i][0], body.dataset.data[i][1]])
 						}

						var temp = newCompany.name
						newCompany.save(function(err, doc) {
							if (err) console.log(err);
							io.emit('add symbol', {'symbol': symbol, 'name': temp})
							res.json({'symbol': symbol, 'name': temp})
						})
					}
				})
			}
			else 
				res.redirect('/')
		})
		
	})
}

function dateFormat(num) {
    return num.toString().length<2?'0'+num:num
}