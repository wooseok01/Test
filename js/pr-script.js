$('#pr-vi-player').load(function(){
    var iframe = $('#pr-vi-player').contents()
    iframe.find('body,html').css('width', '100%')
    iframe.find('#wrapper').css('maxWidth','1440px')
    iframe.find('#wrapper > header').remove()
    iframe.find('#body').css('height','100%')
    iframe.find('#wrapper > footer').remove()
    
    var youtubeUrl = iframe.find('#player').prop('src')
    console.log(youtubeUrl)
    iframe.find('#player').attr('autoplay','0')
    console.log(iframe.find('#player').prop('src'))
})
