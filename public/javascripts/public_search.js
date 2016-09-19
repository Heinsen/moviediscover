$('.movieSearchItem').click(function(){
    const titelRowId = $(this).attr('id');
    const titelSearchInput = $('#movieSearchInput').val();
    window.location.replace('/title/?movieSearchInput=' + titelSearchInput + '&titleId=' + titelRowId);
});