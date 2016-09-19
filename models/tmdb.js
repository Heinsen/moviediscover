var express = require('express');
const jade = require('jade');

var https = require('https');
var querystring = require('querystring');
var model = require('../models/httprequest.js');


var host = 'api.themoviedb.org';
var hostImagePath = 'http://image.tmdb.org/t/p/w300';
var hostImageSmallPath = 'http://image.tmdb.org/t/p/w150';
var hostImageBigPath = 'http://image.tmdb.org/t/p/w500';
var apiKey = '839dbcdefe33cde7581bc17663eacab8';

// Compile the source code
const movietemplateCompiledFunction = jade.compileFile('views/partials/movietemplate.jade');
const casttemplateCompileFunction = jade.compileFile('views/partials/casttemplate.jade');
const personcredittemplateCompileFunction = jade.compileFile('views/partials/personcredittemplate.jade');

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

  console.log(data);

  callback(movieResult, data.original_title);
});
}

function creditLookup(titleId, callback) {
  model.performRequest(host, '/3/movie/' + titleId + '/credits', 'GET', {
    api_key: apiKey
  }, function(data) {
    const castData = data.cast;
    var castDiv = '';

    var nCastMembers = 5;
    if(castData.length < nCastMembers) {
      nCastMembers = castData.length;
    }

    for (index = 0; index < nCastMembers; ++index) {
      var currentCastPerson = castData[index];

      castImagePath = hostImageSmallPath + currentCastPerson.profile_path + '?api_key=' + apiKey;

      castDiv += casttemplateCompileFunction({
        character_name: currentCastPerson.character,
        id: currentCastPerson.id,
        name: currentCastPerson.name,
        cast_image: castImagePath
      });
    }

    console.log(castDiv);

    callback(castDiv);
  });
}

function personLookup(personId, callback) {
  model.performRequest(host, '/3/person/' + personId, 'GET', {
    api_key: apiKey
  }, function(data) {
    const personData = data;
    
    var personObject = {
      id: data.id,
      name: data.name,
      biography: data.biography,
      image: hostImageBigPath + data.profile_path + '?api_key=' + apiKey
    }

    console.log(data);

    callback(personObject);
  });
}

function personCreditLookup(personId, callback) {
 console.log('person');
 model.performRequest(host, '/3/person/' + personId + '/movie_credits', 'GET', {
    api_key: apiKey
  }, function(data) {
    const personCreditData = data.cast;
    var personCreditDiv = '';

    for (index = 0; index < personCreditData.length; ++index) {
      var currentCredit = personCreditData[index];

      posterPath = hostImageSmallPath + currentCredit.poster_path + '?api_key=' + apiKey;

      personCreditDiv += personcredittemplateCompileFunction({
        original_title: currentCredit.original_title,
        release_date: currentCredit.release_date,
        character_name: currentCredit.character,
        title_id: currentCredit.id,
        title_poster: posterPath
      });
    }

    callback(personCreditDiv);
  });
}

module.exports = {
 search : search,
 titleLookup : titleLookup,
 creditLookup : creditLookup,
 personLookup : personLookup,
 personCreditLookup : personCreditLookup
}