//Create iFrame with youtube video when a youtube Video Item is clicked
$('.youtubeVideoItem').click(function(){
     const youtubeVideoItemId = $(this).attr('id');
     const framediv = "<iframe class='youtubeVideoIframe', id='" + youtubeVideoItemId + "', allowfullscreen='allowfullscreen', type='text/html', src='https://www.youtube.com/embed/" + youtubeVideoItemId + "?autoplay=1&origin=http:example.com', frameborder='0'></iframe>";

     $('#iframediv').html(framediv);
});

$('.castItem').click(function(){
    const personId = $(this).attr('id');
    const titelSearchInput = $('#movieSearchInput').val();
    window.location.replace('/person/?movieSearchInput=' + titelSearchInput + '&personId=' + personId);
});