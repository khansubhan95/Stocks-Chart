var mongoose = require('mongoose')

var companySchema = new mongoose.Schema({
	id: String,
	symbol: String,
	name: String
})

module.exports = companySchema