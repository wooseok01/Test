var fs = require('fs'),
    mime = require('mime'),
    _path = require('path'),
    fstream = require('fstream'),
    tar = require('tar'),
    zlib = require('zlib'),
    urlencode = require('urlencode');

function fileSender(root, dir, fileName, response){
    
    var filePath = root + dir + fileName,
        mimeTpye;
	
	function sendData(cb){
    	mimeType = mime.lookup(filePath);
        
        response.charset = 'utf-8';
        response.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(fileName));
        response.setHeader('Content-type', mimeType);
        
        var fileStream = fs.createReadStream(filePath);
        fileStream.pipe(response);
    }

	var sendFile = function(){
        console.log('call sendFile!');
        sendData();
    };

    var sendDir = function(){

        response.charset = 'utf-8';
        response.writeHeader(200,{
            'Content-type' : 'application/octet-stream',
            'Content-Disposition' : 'attachment; filename='+encodeURI(fileName+'.zip'),
            'Content-type' : 'application/zip'
        });

        fstream.Reader({
            'path' : root+dir+fileName,
            'type' : 'Directory'
        }).pipe(tar.Pack())
        .pipe(zlib.Gzip())
        .pipe(response);
    };
    
    return {
        sendFile : sendFile,
        sendDir : sendDir
    };
}

module.exports = fileSender;