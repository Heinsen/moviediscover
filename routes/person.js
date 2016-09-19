var express = require('express');
var router = express.Router();
var model = require('../models/tmdb.js')
var youtubeModel = require('../models/youtube.js')
const wikiModel = require('../models/wikipedia.js')

var movieSearchInput;

var personCreditDivContent, youtubeVideoDivContent, youtubeIFrameDivContent = '';

var personCreditDivFetched, youttubeVideoFetched, wikipedialookupDone = false;
var titlelookupDivContent, personlookupDivContent = '';

var tmdbPersonObject, wikipediaObject;

router.get('/', function(req, res, next) {
  personCreditDivFetched, youttubeVideoFetched, wikipedialookupDone = false;
  personCreditDivContent, youtubeVideoDivContent, youtubeIFrameDivContent = '';
  movieSearchInput = req.query.movieSearchInput;
  personId = req.query.personId;

  model.personLookup(personId, function(personObject) {
    tmdbPersonObject = personObject;
    wikipediaPersonLookup(personObject.name, res);
    youtubePersonLookup(personObject.name, res);
    personMovieCredits(personObject.id, res);
  });
});

function wikipediaPersonLookup(personName, res) {
  wikiModel.searchWikipedia(personName, function(wikipedia) {
    wikipedialookupDone = true;
    wikipediaObject = wikipedia;
    renderPage(res);
  });
}

function youtubePersonLookup(personName, res) {
  youtubeModel.search(personName + ' interview', function(youtubeDivContent, iframDivContent) {
    youttubeVideoFetched = true;
    youtubeVideoDivContent = youtubeDivContent;
    youtubeIFrameDivContent = iframDivContent;
    renderPage(res);
  });
}

function personMovieCredits(personId, res) {
  model.personCreditLookup(personId, function(personCreditDiv) {
    personCreditDivFetched = true;
    personCreditDivContent = personCreditDiv;
    renderPage(res);
  });
}

function renderPage(res) {
  if(personCreditDivFetched == true && youttubeVideoFetched == true && wikipedialookupDone == true) {
    res.render('person', { 
      title: 'Movie Discover', 
      movieSearchInput: movieSearchInput,
      tmdb: tmdbPersonObject,
      wikipedia: wikipediaObject,
      personCredit: personCreditDivContent,
      selectedVideo: youtubeIFrameDivContent,
      youtubeData: youtubeVideoDivContent
    });
  }
}

function renderIndexPage(res) {
  res.render('index', { title: 'Movie Discover', movieSearchInput: '' });
}

module.exports = router;