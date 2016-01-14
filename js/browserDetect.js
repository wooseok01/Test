!function () {
    var old

    if (bowser.msie && bowser.version < 9) old = true
    else if (bowser.firefox && bowser.version < 42) old = true
    else if (bowser.chrome && bowser.version < 34) old = true
    else if (bowser.safari && bowser.version < 8) old = true
    else if (bowser.opera && bowser.version < 13) old = true
    // others are allowed

    if (old) location.href = '404/unsupported.html'
}()

// end of browserDetect.js
