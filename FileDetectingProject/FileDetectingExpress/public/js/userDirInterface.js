function getDirPath(path){
    var getRootDir = function(cb){
        $.ajax({
            url : '/getRootData',
            dataType : 'json',
            success : function(data){
                if(data!=null)cb(data);
	        },
	        error : function(err){
	            cb(err, null);
	        }
	    });
    }
    
    var getDir = function(fileName, cb){
        console.log('not root!');
    	$.ajax({
   	        url : '/getDirData',
   	        data : {
   	            path : fileName
   	        },
   	        dataType : 'json',
   	        type : 'post',
            success : function(data){
   	            if(data != null) cb(data);
   	            else cb(null);
            },
            error : function(err){
                console.log(err.message);
            }
        });
    }
    
    function insertTableElement(target, data, fileName, indent){
        //console.log(target.attr('id'));
        data.forEach(function(element, index) {
            var tr = $('<tr></tr>');
            var td = $('<td class="center"></td>');
            var tab = '';
            if(element.isDirectory == true){
        	    td.addClass('cursor');
        	    td.html('>');
                tr.append(td);
                tr.append($('<td></td>').html(element.ino).hide());
            }else{
                tr.append($('<td class="center"></td>'));
                
            }
            
            for(var i=0; i<indent; i++){
                tab+='&nbsp;&nbsp;&nbsp;';
            }
            
            tr.append($('<td class="left"></td>').html(tab+element.name));
            tr.append($('<td class="center"></td>').html(tab+element.made));
            tr.append($('<td class="center"></td>').html(tab+element.changed));
            tr.append($('<td class="center"></td>').html(tab+element.retired));
            tr.append($('<td class="indent"></td>').html(indent).hide());
            
            if(target.attr('id') == 'tbody'){
                target.append(tr);
            }else{
                //console.log('1');
            	console.log(element.ino);
                tr.addClass('i'+target.parent().children().eq(1).html());
                target.parent().after(tr);
                //console.log('2');
            }
    	});
    }
    
    return {
    	getDir : getDir,
    	getRootDir : getRootDir,
    	insertTableElement : insertTableElement
    };
}