$(document).ready(function(){
	
	var getGroupInterface = groupDirInterface();
	getGroupInterface.getGroupList();
	
    $('#addGroup').click(function(){
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
                        location.href = '/addGroup?groupName='+groupName;
                    }
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
    
    if($('#addGroupErr').html() != undefined) alert('그룹 생성 에러!');
    
    $('#diBox').hide();
    
    $('#goToPrivate').click(function(){
        location.href='/main';
    });
});