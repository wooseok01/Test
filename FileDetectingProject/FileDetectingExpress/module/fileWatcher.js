var hound = require('hound');
var mailSender = require('./mailSender');
var fs = require('fs'),
    fsExtra = require('fs-extra'),
    autoRemove = require('./autoRemove'),
    dao = require('./dao'),
    async = require('async');

function autoFileDetect(root, dir){
    var watcher = hound.watch(root + dir);
    var serverUrl = 'localhost:3000';

    watcher.on('create', function(file, state){
        if(!file.match('.DS_Store')){
            var substring = file.substring((root + dir +'/').length, file.length);
            var parentDirPlag = substring.indexOf('/');
            if(parentDirPlag === -1){
                console.log(file + ' is added!');
                var title = file.substring(root.length, file.length) + '가 추가되었습니다.';
                var text = '<a href="' + serverUrl + file.substring(root.length, file.length) + '">링크를 클릭하면 다운로드가 진행됩니다.</a>';
                mailSender('wooseok01@naver.com', title, text);
                //autoRemove(file);
            }
    	}
    });
}

module.exports = autoFileDetect;