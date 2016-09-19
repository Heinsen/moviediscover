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

var titlelookupDone, castlookupDone = false;
var titlelookupDivContent, castlookupDivContent = '';

router.get('/', function(req, res, next) {
  youttubeVideoFetched = false;
  titlelookupDone, castlookupDone = false;

  movieSearchInput = req.query.movieSearchInput;
  titleId = req.query.titleId;

  model.titleLookup(req.query.titleId, function(movieDivContent, movieTitle) {
    youtubeTralierLookup(movieTitle, res);

    titlelookupDone = true;
    titlelookupDivContent = movieDivContent;
    // renderPage(res);
  });

  model.creditLookup(req.query.titleId, function(castDivContent) {
    castlookupDone = true;
    castlookupDivContent = castDivContent;
    renderPage(res);
  });

});

function youtubeTralierLookup(title, res) {
  youtubeModel.search(title + ' trailer', function(youtubeDivContent, iframDivContent) {
    youttubeVideoFetched = true;
    youtubeVideoDivContent = youtubeDivContent;
    youtubeIFrameDivContent = iframDivContent;
    renderPage(res);
  });
}

function renderPage(res) {

  if(youttubeVideoFetched == true && titlelookupDone == true && castlookupDone == true) {
    res.render('title', { 
      title: 'Movie Discover', 
      movieSearchInput: movieSearchInput, 
      titleId: titleId,
      titleData: titlelookupDivContent,
      castData: castlookupDivContent,
      selectedVideo: youtubeIFrameDivContent,
      youtubeData: youtubeVideoDivContent 
    });
  }
}

module.exports = router;