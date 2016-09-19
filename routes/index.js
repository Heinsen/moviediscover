var express = require('express');

const jade = require('jade');
var router = express.Router();
var model = require('../models/tmdb.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Movie Discover', movieSearchInput: '' });
});

router.get('/search', function(req, res, next) {
	//TODO: Do error handling in case parameter is not present
	model.search(req.query.movieSearchInput, function(movieDivContent) {
  		res.render('search', { movieSearchInput: req.query.movieSearchInput, searchResults: movieDivContent });
	});
});

module.exports = router;
