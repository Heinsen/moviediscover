const express = require('express');
const jade = require('jade');
var model = require('../models/httprequest.js');

const hostPath = 'en.wikipedia.org';
const hostArticlePath = '/w/api.php';

function search(searchInput, callback) {
  model.performRequest(hostPath, hostArticlePath, 'GET', {
    format: 'json',
    action: 'query',
    prop: 'extracts',
    exintro: '1',
    explaintext: '1',
    indexpageids: '1',
    titles: 'Johnny Depp'
  }, function(data) {
  	
  	var wikiResults = data.query;
	var wikiResultsDiv = '';
    
    console.log(data);
    console.log(wikiResults.pages[wikiResults.pageids[0]].extract);

    
    callback(wikiResults);
  });
}

module.exports = {
  searchWikipedia : search
}