var express = require('express');
var router = express.Router();
var model = require('../models/tmdb.js')
var youtubeModel = require('../models/youtube.js')
const wikiModel = require('../models/wikipedia.js')

var movieSearchInput = '';
var titleId = '';

var youttubeVideoFetched = false;
var youtubeVideoDivContent = '';
var youtubeIFrameDivContent = '';

var titlelookupDone = false;
var titlelookupDivContent = '';

router.get('/', function(req, res, next) {
  youttubeVideoFetched = false;
  titlelookupDone = false;

  movieSearchInput = req.query.movieSearchInput;
  titleId = req.query.titleId;

  model.titleLookup(req.query.titleId, function(movieDivContent) {
    titlelookupDone = true;
    titlelookupDivContent = movieDivContent;
    renderPage(res);
  });

  youtubeModel.search(req.query.movieSearchInput, function(youtubeDivContent, iframDivContent) {
    youttubeVideoFetched = true;
    youtubeVideoDivContent = youtubeDivContent;
    youtubeIFrameDivContent = iframDivContent;
    renderPage(res);
  });

  wikiModel.searchWikipedia('Matt Damon', function(wikiDivContent) {
    
    
  });

});

function renderPage(res) {

  if(youttubeVideoFetched == true && titlelookupDone == true) {
    res.render('title', { 
      title: 'Movie Discover', 
      movieSearchInput: movieSearchInput, 
      titleId: titleId,
      titleData: titlelookupDivContent,
      selectedVideo: youtubeIFrameDivContent,
      youtubeData: youtubeVideoDivContent 
    });
  }
}

module.exports = router;