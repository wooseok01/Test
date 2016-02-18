$(document).ready(function(){
    var userDirInterface = getDirPath(null);
    
    userDirInterface.getRootDir(function(data){
        var tbody = $('#tbody');
        userDirInterface.insertTableElement(tbody, data, null, 0);
    });
    
    $(document).on('click','td', function(){

    	var target = $(this);
        if(target.html() == '&gt;' || target.html() == '>'){
            target.html('&or;');
            
            if(!target.attr('data-toggled') || target.attr('data-toggled') == 'off'){
                
            	target.attr('data-toggled','on');
                
                var fileName = target.parent().children().eq(2).html();
                var indent = target.parent().children().eq(6).html();
                
                indent = Number(indent);
                fileName = fileName.replace(/\&nbsp\;/g, '');
                userDirInterface.getDir(fileName, function(data){
                	if(data == null) return;
                	else userDirInterface.insertTableElement(target, data, fileName, (indent+1));
                });
            }
        }else if(target.html() == '&or;' || target.html()=='∨'){
            target.html('&gt;');
            
            if(target.attr('data-toggled') == 'on'){
                target.attr('data-toggled','off');
                var fileIno = target.parent().children().eq(1).html();
                console.log(fileIno);
                $('.i'+fileIno).remove();
            }
        }
    });
    
    $('#makeGroup').click(function(){
        $('#diBox').dialog({
        	autoOpen : false,
        	resizable : false,
        	title : '그룹 생성',
            open : function(){
                $(this).find('[type=submit]').hide();
            },
            
            buttons : [
                {
                    text : 'Create',
                    click : function(){
                        var groupName = $('#groupName').val();
                        $.ajax({
                            url : '/addGroup',
                            data : {
                                groupName : groupName
                            },
                            type : 'post',
                            success : function(bool){
                            	if(bool == true) alert('그룹 생성 완료!');
                                $(this).dialog('close');
                            },
                            error : function(){
                                alert('그룹 생성시 오류 발생!');
                                $(this).dialog('close');
                            }
                        })
                    },
                },
                {
                    text : 'Cancel',
                    click : function(){
                        $(this).dialog('close');
                    }
                }
            ]
        });
        $('#diBox').dialog('open');
    });
    
});

function deleteIndent(fileName){
    
}