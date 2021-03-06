var mongo = require('mongojs'),
    db = mongo('fileDetecting',['userFileList','userList','groupList']),
    userList = db.userList,
    userFileList = db.userFileList,
    groupList = db.groupList,
    fs = require('fs'),
    async = require('async');

var root = '/home/songwooseok/Documents',
    dir = '/root';

function joinUser(post, cb){
    
	userList.save({
        id : post.id,
        pass : post.pass,
        name : post.name,
        groupList : null
    });
	
	userList.findOne({id : post.id}, function(err, data){
		userFileList.save({
		    id : post.id,
		    path : root+dir+'/'+data._id
		});
	    cb(null,data);
	});
    
}

function loginCheck(post, cb){
    userList.findOne({id : post.id, pass : post.pass}, function(err, data){
    	
        if(data){
            cb(null, {id : data.id, name : data.name, _id : data._id});
        }else{
            cb(new Error('login fail!', null));
        }
    });
}

function getRootFile(user,cb){
    userFileList.findOne({id : user.id}, function(err, data){
    	console.log(data);
        if(err) return ;
        if(!data) return ;
        var rootPath = data.path;
        console.log(rootPath);
        var fileList=[];
        
        fs.readdir(rootPath, function(err, files) {
            files.forEach(function(file, index) {
                fs.stat(rootPath+'/'+file, function(err, stats) {
                	ctimeFormat = stats.ctime;
                	mtimeFormat = stats.mtime;
                    fileList.push({
                    	ino : stats.ino,
                        name : file,
                        isDirectory : stats.isDirectory(),
                        made : ctimeFormat.getFullYear()+'/'+(ctimeFormat.getMonth()+1)+'/'+ctimeFormat.getDate()+' '+ctimeFormat.getHours()+':'+ctimeFormat.getMinutes(),
                        changed : mtimeFormat.getFullYear()+'/'+(mtimeFormat.getMonth()+1)+'/'+mtimeFormat.getDate()+' '+mtimeFormat.getHours()+':'+mtimeFormat.getMinutes(),
                        retired : 'xxxxx'
                    });
                    //console.log(stats.ctime.getFullYear());

                    if(index == files.length-1){
                        if(err) cb(new Error(err.message), null);
                        else cb(null,fileList);
                    }
                });
            });
            return fileList;
        });
    });
}

function getDirData(user, path, cb){
    userFileList.findOne({id:user.id}, function(err, data){
        var rootPath = data.path;
        path = rootPath + '/' + path;
        
        var fileList = [];
        fs.readdir(path, function(err, files) {
        	if(err){
        	    console.log(err.message);
        	    return cb(err, null);
        	}
        	console.log('file -> ' + files);
            files.forEach(function(file, index){
                fs.stat(path+'/'+file, function(err,stats){
                	console.log(stats.ino);
                	ctimeFormat = stats.ctime;
                	mtimeFormat = stats.mtime;
                    fileList.push({
                    	ino : stats.ino,
                        name : file,
                        isDirectory : stats.isDirectory(),
                        made : ctimeFormat.getFullYear()+'/'+(ctimeFormat.getMonth()+1)+'/'+ctimeFormat.getDate()+' '+ctimeFormat.getHours()+':'+ctimeFormat.getMinutes(),
                        changed : mtimeFormat.getFullYear()+'/'+(mtimeFormat.getMonth()+1)+'/'+mtimeFormat.getDate()+' '+mtimeFormat.getHours()+':'+mtimeFormat.getMinutes(),
                        retired : 'xxxxx'
                    });
                    
                    if(index == files.length-1){
                        if(err) cb(new Error(err.message), null);
                        else cb(null, fileList);
                        return;
                    }
                });
            });
        });
    });
}

function getGroupList(user,cb){
    userList.findOne({id : user.id}, function(err, data){
        var groupList = data.groupList;
        console.log('groupList -> '+groupList);
        if(groupList == null){
        	cb(null);
        }else{
            cb(groupList);
        }
    });
}

function addGroup(groupName, user, cb){
	var _groupList;
    userList.findOne({id : user.id}, function(err, data){
        _groupList = data.groupList;
        if(_groupList){
        	
            _groupList.push({groupName : groupName});
        }else{
            _groupList = [];
            _groupList.push({groupName : groupName});
        }
        userList.update({id : user.id}, {$set : {groupList : _groupList}}, function(err){
            if(err) cb(false);
        });
        groupList.findOne({groupName : groupName}, function(err, data){
            if(err) cb(false);
            else if (data == null){
                insertGroupListCollection(groupName, user, cb);
            }
        });
    });
}

function insertGroupListCollection(groupName, user, cb){
    groupList.findOne({groupName : groupName}, function(err, data){
        if(data != null) cb(false);
        else if(data == null){
        	var members = [];
        	members.push({id : user.id});
            groupList.save({
                groupName : groupName,
                members : members
            }, function(err){
                if(err) cb(false);
                else cb(true);
            });
        }
    });
}

function getUserId(objId, cb){
    userList.findOne({_id : new mongo.ObjectID(objId)}, function(err, data){
    	console.log('mail ---->>>> '+data.id);
        if(err) cb(err,null);
        else cb(null,data.id);
    });
}


module.exports = {
    joinUser : joinUser,
    loginCheck : loginCheck,
    getRootFile : getRootFile,
    getDirData : getDirData,
    getGroupList : getGroupList,
    addGroup : addGroup,
    getUserId : getUserId
};