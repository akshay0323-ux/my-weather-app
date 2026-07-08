const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
    cityName: String,
    searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', SearchSchema);