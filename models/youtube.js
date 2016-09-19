const express = require('express');
const jade = require('jade');
var model = require('../models/httprequest.js');

var host = 'www.googleapis.com';
var host_youtube = '/youtube/v3/search';
var apiKey = 'AIzaSyAItRgkXdmdyxskbaz2eSksUav_NR3U39Y';
var firstVidoeIframe = '';

// Compile the source code
const videotemplateCompiledFunction = jade.compileFile('views/partials/videotemplate.jade');

function search(searchInput, callback) {
  model.performRequest(host, host_youtube, 'GET', {
    key: apiKey,
    part: "snippet",
    type: "video",
    q: searchInput
  }, function(data) {
  	var videoResults = data.items;
	var videoResultsDiv = '';

	if(videoResults.length > 0) {
		firstVidoeIframe = "<iframe class='youtubeVideoIframe', id='" + videoResults[0].id.videoId + "', allowfullscreen='allowfullscreen', type='text/html', src='https://www.youtube.com/embed/" + videoResults[0].id.videoId + "?autoplay=0&origin=http:example.com', frameborder='0'></iframe>";
	}
    
    for (index = 0; index < videoResults.length; ++index) {
    	var currentVideo = videoResults[index];
    	
    	var thumbnailUrl = 'http://img.youtube.com/vi/' + currentVideo.id.videoId + '/mqdefault.jpg';

      	// Build up table row data sets for movietemplate
      	videoResultsDiv += videotemplateCompiledFunction({
       		id: currentVideo.id.videoId,
       		title: currentVideo.snippet.title,
       		description: currentVideo.snippet.description,
       		publishAt: currentVideo.snippet.publishAt,
       		thumbnail: thumbnailUrl
     	});
    	
    }
   	
    callback(videoResultsDiv, firstVidoeIframe);
  });
}

module.exports = {
  search : search
}