var express = require('express');
const jade = require('jade');

var https = require('https');
var querystring = require('querystring');
var model = require('../models/httprequest.js');


var host = 'api.themoviedb.org';
var hostImagePath = 'http://image.tmdb.org/t/p/w300/';
var hostImageBigPath = 'http://image.tmdb.org/t/p/w500/';
var apiKey = '839dbcdefe33cde7581bc17663eacab8';

// Compile the source code
const movietemplateCompiledFunction = jade.compileFile('views/partials/movietemplate.jade');

function search(searchInput, callback) {
  model.performRequest(host, '/3/search/movie', 'GET', {
    api_key: apiKey,
    query: searchInput
  }, function(data) {
  	var movieResults = data.results;

  	var searchReusltDiv = '';

    for (index = 0; index < movieResults.length; ++index) {
    	var currentMovie = movieResults[index];
    	
      if(currentMovie.poster_path != null) {
       host_poster_path = hostImagePath + currentMovie.poster_path + '?api_key=' + apiKey;
     }
     else {
       host_poster_path = '/images/logo.png';
     }
      // Build up table row data sets for movietemplate
      searchReusltDiv += movietemplateCompiledFunction({
       titel_id: currentMovie.id,
       poster_path: host_poster_path,
       release_date: currentMovie.release_date,
       original_title: currentMovie.original_title,
       vote_average: currentMovie.vote_average
     });
      // console.log(movieResults);
    }
    callback(searchReusltDiv);
  });
}

function titleLookup(titleId, callback) {
   console.log(titleId);
   model.performRequest(host, '/3/movie/' + titleId, 'GET', {
    api_key: apiKey
  }, function(data) {
    
    posterPath = hostImageBigPath + data.poster_path + '?api_key=' + apiKey;

    var movieResult = {
      original_title: data.original_title,
      overview: data.overview,
      release_date: data.release_date,
      runtime: data.runtime,
      tagline: data.tagline,
      vote_average: data.vote_average,
      poster_path: hostImageBigPath + data.poster_path + '?api_key=' + apiKey

    }

    console.log(movieResult);

    callback(movieResult);
  });
}

module.exports = {
  search : search,
  titleLookup : titleLookup
}