var mongoose = require('mongoose')

var companySchema = new mongoose.Schema({
	id: String,
	symbol: String,
	name: String,
	start_date: String,
	end_date: String,
	stocks: {type: Array, "default": []}
})

module.exports = companySchema