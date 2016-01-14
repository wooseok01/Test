function alleys(windowControl) {
    'use strict'

    var $header, $video, $nav, $iframe, $bottom, $footer
    var prevContext, currentContext
    var emul

    var _clone = function (obj) {
        var copy

        if (obj === null || typeof obj !== 'object') return obj
        copy = obj.constructor()
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) copy[prop] = obj[prop]
        }

        return copy
    }

    var _getViewport = function () {
        var viewport = window.getComputedStyle(document.body, ':after').getPropertyValue('content')

        if (viewport.indexOf('tablet') >= 0) return 'tablet'
        if (viewport.indexOf('mobile') >= 0) return 'mobile'
        return 'full'
    }

    var _isLandscape = function () {
        return ($(window).width() > $(window).height())
    }

    var landscape = function (on) {
        if (!bowser.mobile && !bowser.tablet) return

        if (typeof on !== 'boolean') on = _isLandscape()

        if (on) {
            if (windowControl.isOpen()) windowControl.close()
            $header.css('display', 'none')
            $bottom.css('display', 'none')
            $nav.css('display', 'none')
            $footer.css('display', 'none')
            $video.css('width', '100%')
        } else {
            $header.css('display', 'table')
            $bottom.css('display', 'block')
            $nav.css('display', 'block')
            $footer.css('display', 'block')
        }

        return on
    }

    var _setNavStyle = function (h) {
        $nav.removeClass('transition').css(h)
        setTimeout(function () {
            $nav.addClass('transition')
        }, 1)
    }

    var adjustNavHeight = function () {
        switch(currentContext.viewport) {
            case 'full':
                _setNavStyle({
                    height: $video.height()
                })
                break
            case 'tablet':
                _setNavStyle({
                    height: Math.max(
                                $(window).height()-$header.outerHeight(true)-
                                    $iframe.outerHeight(true),
                                $bottom.outerHeight(true)
                            )
                })
                break
            case 'mobile':
                _setNavStyle({
                    height: 'auto'
                })
                break
        }
    }

    // ensures transitionend callback always triggered
    $.fn.emulateTransitionEnd = function (duration, out) {
        var called = false, $el = this, timer

        var callback = function () {
            if (!called) $($el).trigger('transitionend')
        }

        $(this).one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
            function () {
            called = true
        })
        timer = setTimeout(callback, duration)
        if (out) out.timer = timer

        return this
    }

    var refreshNav = function () {
        var height

        currentContext.viewport = _getViewport()
        if (currentContext.viewport === 'mobile') currentContext.showNav = true
        currentContext.isLandscape = _isLandscape()

        if (prevContext.viewport === currentContext.viewport &&
            prevContext.showNav === currentContext.showNav &&
            prevContext.isLandscape === currentContext.isLandscape) return

        $('#btn-nav a')[(currentContext.showNav)? 'addClass': 'removeClass']('active')

        // cancels on-going transitions
        $video.off()
        $nav.off()
        if (emul && emul.timer) cancelTimeout(emul.timer)

        switch(currentContext.viewport) {
            case 'full':
                landscape(false)

                $footer.css({
                    'margin-left': 0,
                    width:         '100%'
                })
                $nav.css('overflow', 'hidden')    // #63

                if (currentContext.showNav) {
                    $header.css('width', '80%')
                    $bottom.css('width', '80%')
                    $nav.css('margin-left', 0)
                    $video.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
                        function () {
                        adjustNavHeight()
                        $nav.css('display', 'block')
                        $nav.one('transitionend webkitTransitionEnd oTransitionEnd'+
                                 ' MSTransitionEnd', function () {    // #63
                            $nav.off()
                                .css('overflow', 'auto')
                        })
                        setTimeout(function () {
                            adjustNavHeight()    // for stupid Chrome
                            $nav.emulateTransitionEnd(500+50, emul)    // #63
                                .css('opacity', 1)
                        }, 1)
                    })
                    $video.emulateTransitionEnd(500+50, emul)
                          .css('width', '80%')
                } else {
                    $video.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
                        function () {
                        adjustNavHeight()
                    })
                    $nav.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
                        function () {
                        $nav.off()
                        $header.css('width', '100%')
                        $bottom.css('width', '100%')
                        $nav.css('display', 'none')
                        $video.emulateTransitionEnd(500+50, emul)
                              .css('width', '100%')
                    })
                    $nav.emulateTransitionEnd(500+50, emul)
                        .css('opacity', 0)
                }
                break
            case 'tablet':
                if (landscape(currentContext.isLandscape)) break

                $header.css('width', '100%')
                $video.css('width', '100%')

                if (currentContext.showNav) {
                    $nav.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
                        function () {
                        $nav.off()
                        $nav.css('overflow', 'auto')
                        adjustNavHeight()
                    })

                    $bottom.css('width', '50%')
                    $footer.css({
                        'margin-left': '50%',
                        width:         '50%'
                    })
                    $nav.css('overflow', 'hidden')
                        .css('display', 'block')
                    setTimeout(function () {
                        $nav.emulateTransitionEnd(500+50, emul)
                            .css({
                            'margin-left': 0,
                            opacity:       1
                        })
                    }, 50)    // 50ms to wait for $bottom to start to shrink
                } else {
                    $nav.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
                        function () {
                        $nav.off()
                        $nav.css('display', 'none')
                        adjustNavHeight()
                    })
                    $nav.emulateTransitionEnd(500+50, emul)
                        .css({
                        overflow:      'hidden',
                        'margin-left': '-50%',
                        opacity: 0
                    })
                    setTimeout(function () {
                        $bottom.css('width', '100%')
                        $footer.css({
                            'margin-left': 0,
                            width:         '100%'
                        })
                    }, 50)    // 50ms to wait for $nav to start to move
                }
                break
            case 'mobile':
                if (landscape(currentContext.isLandscape)) break

                $header.css('width', '100%')
                $video.css('width', '100%')
                $bottom.css('width', '100%')
                $nav.css({
                    'margin-left': 0,
                    opacity:       1,
                    display:       'block',
                    overflow:      'visible'
                })
                $footer.css({
                    'margin-left': 0,
                    width:         '100%'
                })
                break
        }

        prevContext = _clone(currentContext)
    }

    var toggleNav = function () {
        currentContext.showNav = !currentContext.showNav
        refreshNav()

        return false
    }

    // should be replaced by position:sticky in the future
    var stickyVideo = function () {
        if (currentContext.viewport === 'mobile' &&
            $(window).scrollTop() >= $header.outerHeight(true)) {
            _setNavStyle({
                'margin-top': $video.outerHeight(true)
            })
            $video.css('position', 'fixed')
        } else {
            _setNavStyle({
                'margin-top': 0
            })
            $video.css('position', 'relative')
        }
    }

    prevContext = {}
    currentContext = {
        viewport:    _getViewport(),
        isLandscape: _isLandscape(),
        showNav:     true
    }

    $header = $('header')
    $video = $('.video-container')
    $nav = $('nav')
    $iframe = $('iframe')
    $bottom = $('#btm-controller')
    $footer = $('footer')

    return {
        landscape:       landscape,
        adjustNavHeight: adjustNavHeight,
        refreshNav:      refreshNav,
        toggleNav:       toggleNav,
        stickyVideo:     stickyVideo
    }
}


// starts here
$(document).ready(function () {
    'use strict'

    var urlPrefix = 'http://alleys.co/video/?id='
    var player, a, id, parse, autoplay

    var _makeQuery = function (json) {
        var query = ''

        for (var key in json) {
            if (typeof json[key] !== 'function' && json.hasOwnProperty(key)) {
                query += '&'+key+'='+encodeURI(json[key])
            }
        }

        return query
    }

    var _goTo404 = function (err) {
        location.href = 'http://alleys.co/video/404/'
    }

    var _getParam = function (name) {
        var regex, jsons

        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
        regex = new RegExp('[\\?&]'+name+'=([^&#]*)')
        jsons = regex.exec(location.search)

        return (jsons === null)? '': decodeURIComponent(jsons[1].replace(/\+/g, ' '))
    }

    var _setPlayer = function () {
        var timer = null

        player = new YT.Player('player', {
            events: {
                onReady: function (event) {
                    a.adjustNavHeight()    // after video loaded
                    $('#loading').fadeOut(500)
                    if (!bowser.mobile && !bowser.tablet && (autoplay == undefined)) event.target.playVideo()
                },
                onStateChange: function (event) {
/*
                    if (event.data === -1 || event.data === YT.PlayerState.BUFFERING) {
                        if (!timer) {
                            timer = setTimeout(function () {
                                if (player.getPlayerState() === YT.PlayerState.BUFFERING) {
                                    $('#loading').css('display', 'block')
                                }
                            }, 1000)
                        }
                    } else {
                        if (timer) {
                            clearTimeout(timer)
                            timer = null
                        }
                        $('#loading').css('display', 'none')
                    }
*/
                }
            }
        })
    }

    var _windowControl = (function () {
        var top = 0, isOpen, emul
        var $btnShare = $('#btn-share a')
        var $overlay = $('#overlay')
        var $window = $('#window')
        var $windowQr = $('#window-qr')
        var $windowUrlInput = $('#window-url input')
        var $wrapper = $('#wrapper')

        return {
            isOpen: function () {
                return isOpen
            },
            close: function () {
                isOpen = false
                $windowUrlInput.blur()    // #61
                $overlay.off()
                if (emul && emul.timer) cancelTimeout(emul.timer)
                $wrapper.off()
                        .one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
                    function () {
                    $wrapper.off()
                            .removeClass('blur-out')
                    $btnShare.removeClass('active')
                    $overlay.css('display', 'none')
                    $windowQr.empty()
                })
                $window.fadeOut(450, function () {    // 450ms to draw body before $overlay gone
                    $('body').css({
                        position: 'static',
                        overflow: 'visible'
                    }).scrollTop(top)
                })
                $wrapper.emulateTransitionEnd(500+50, emul)
                if (bowser.msedge || bowser.firefox || bowser.chrome || bowser.safari ||
                    bowser.opera) {
                    $wrapper.removeClass('blur-in').addClass('blur-out')
                } else {
                    $overlay.removeClass('darken')
                }

                return false
            },
            open: function () {
                var copySupported, qrcode
                var $msg = $('#window-url > div')

                var copied = function () {
                    $msg.text('URL copied')
                    setTimeout(function () {
                        _windowControl.close()
                        $msg.empty()
                    }, 1000)
                }

                isOpen = true
                copySupported = (typeof document.queryCommandSupport === 'function' &&
                                 document.queryCommandSupported('copy')) ||
                                (!bowser.mobile && !bowser.tablet)
                $wrapper.off()
                top = $('body').scrollTop()
                $('body').css({
                    position: 'fixed',
                    overflow: 'hidden',
                    top:      -top
                })
                $btnShare.addClass('active')
                $windowUrlInput.attr('value', urlPrefix+id)

                if (!copySupported) {
                    $('#window-url input').replaceWith(
                        $('<a href="'+urlPrefix+id+'" class="url-font">'+urlPrefix+id+'</a>')
                    )
                    $('#window-btn-copy').remove()
                    $('#window-btn-cancel').css({
                        width:        '100%',
                        padding:      0,
                        'text-align': 'center'
                    }).text('Close')
                }
                $overlay.css('display', 'block')
                qrcode = new QRCode($windowQr[0], {
                    text:   urlPrefix+id,
                    width:  150,
                    height: 150
                })
                $window.fadeIn(500, function () {
                    $windowUrlInput.focus().select()
                })
                if (bowser.msedge || bowser.firefox || bowser.chrome || bowser.safari ||
                    bowser.opera) {
                    $wrapper.removeClass('blur-out').addClass('blur-in')
                } else {
                    $overlay.addClass('darken')
                }
                $('#window-btn-cancel').click(_windowControl.close)
                if (copySupported) {
                    $('#window-btn-copy').click(function () {
                        var success, ctrl

                        try {
                            success = document.execCommand('copy')
                        } catch(e) {
                            success = false
                        }
                        if (!success) {
                            ctrl = (navigator.platform.toUpperCase().indexOf('MAC') >= 0)? '⌘': 'Ctrl'
                            $('#window-btn-cancel').text('Close')
                            $msg.text('Press '+ctrl+'+C to copy')
                        } else {
                            copied()
                        }
                        $windowUrlInput.focus().select()

                        return false
                    })
                }
                $overlay.click(_windowControl.close)

                return false
            }
        }
    })()

    $('#loading, #wrapper').css('display', 'block')

    a = alleys(_windowControl)
    id = _getParam('id')
    autoplay = _getParam('autoplay')

    $(window).on('resize', function () {
        a.refreshNav()
        a.adjustNavHeight()
    })
    if ($('.video-container').css('position').search('sticky') < 0) $(window).on('scroll', a.stickyVideo)
    $('#loading > div').css('padding', ($(window).width()*0.08)+'px 0')

    parse = parseInterface(id)
    parse.getRecordMetaData(function (err, json) {
        var cps
        var arrow = {
            '0': {
                class: 'list-icon-info',
                text:  '&#9432'
            },
            '-90': {
                class: 'list-icon-left',
                text:  '&#8624;'
            },
            '90': {
                class: 'list-icon-right',
                text:  '&#8625;'
            }
        }
        var ytParams = {
            rel:            0,    // no related videos
            modestbranding: 1,    // no YouTube logo
            loop:           0,    // no repeat
            iv_load_policy: 3,    // no interactive video
            fs:             1,    // full-size
            playsinline:    1,    // play inline on iOS webview
            showinfo:       0     // no video info
        }

        if (err) _goTo404(err)

        a.landscape()

        if (ytParams.loop) ytParams.playlist = json.youtubeId
        json.youtubeUrl = 'https://www.youtube.com/embed/'+json.youtubeId+'?enablejsapi=1'+
                          _makeQuery(ytParams)

        if (json.photo) $('.user-profile img').attr('src', json.photo)
        $('.user-profile > div:nth-child(2)').append(json.username)

        $('.video-title').append(json.title)
        $('.video-subtitle').append(json.description)

        $('.video iframe').attr('src', json.youtubeUrl)
        $.getScript('https://www.youtube.com/iframe_api', function (script, textStatus, jqXHR) {
            if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
                window.onYouTubeIframeAPIReady = _setPlayer
            } else {
                _setPlayer()
            }
        })

        cps = json.subtitle.checkPoints
        if (cps && cps.length && cps[0]) {
            for (var i = 0; i < cps.length; i++) {
                $('<div class="list clickable">'+
                    '<div>'+
                      '<div class="list-num list-num-font">'+(i+1)+'</div>'+
                      '<div class="list-title list-title-font">'+cps[i].where+'</div>'+
                      '<!-- div class="list-info list-info-font">...</div -->'+
                      '<div class="list-icon">'+
                        '<div class="'+arrow[cps[i].degree].class+'">'+
                          '<span style="display:none">'+arrow[cps[i].degree].text+'</span>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>').appendTo('nav').click((function (i) {
                    return function () {
                        player.seekTo(cps[i].time / 1000)
                        return false
                    }
                })(i))
            }
        }
        a.adjustNavHeight()    // #64

        $('#btn-share a').click(_windowControl.open)
        $('#btn-nav a').click(a.toggleNav)

        $('#window').click(function () { return false })    // masks events for overlay

        if (!json.pdfUrl) {
            $('#btn-pdf').find('a').css({
                opacity: 0.2,
                cursor:  'no-drop'
            })
        } else {
            $('#btn-pdf').find('a').prop('href', json.pdfUrl)
        }
    })
})

// end of script.js
