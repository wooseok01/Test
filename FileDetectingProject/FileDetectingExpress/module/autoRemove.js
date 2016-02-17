var fs = require('fs'),
    fsExtra = require('fs-extra');

function autoRemove(file){
    setTimeout(function(){
        fs.stat(file, function(err, stats) {
            if(stats.isFile()){
                fs.unlink(file);
            }else{
                fsExtra.remove(file);
            }
        });	
    }, 60*1000);
}

module.exports = autoRemove;