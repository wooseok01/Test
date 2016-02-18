function groupDirInterface(){
    var getGroupList = function(){
        $.ajax({
            url : '/getGroupList',
            dataType : 'json',
            success : function(data){
            	var groupList = $('#groupList');
                data.forEach(function(element, index) {
                    var div = $('<div class="group"></div>');
                    var img = $('<img></img>');
                    var aTag = $('<a></a>').html(element.groupName);
                    
                    img.attr('src','../public/img/images.jpeg');
                    aTag.attr('href','/selectGroup?groupName='+element.groupName);
                    
                    div.append(img);
                    div.append('<br>');
                    div.append(aTag);
                    
                    groupList.append(div);
                });
            },
            error : function(err){
                console.log(err.message);
            }
        });
    }
	return {
	    getGroupList : getGroupList
	};
}