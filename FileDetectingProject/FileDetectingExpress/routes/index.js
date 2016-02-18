var express = require('express'),
    router = express.Router(),
    url = require('url'),
    urlencode = require('urlencode'),
    fs = require('fs'),
    dao = require('../module/dao');

var root = '/home/songwooseok/Documents';
var dir = '/root';
    

router.get('/', function(req, res, next){
	
    if(req.session.user){
    	res.redirect('main',{id : req.session.user.id, name : req.session.user.name});
    }

    res.render('index',{
       title : 'indexPage!'
    });
});


router.get('/join', function(req, res, next){
    res.render('join');
    
});


router.post('/join', function(req, res, next){
    var post = req.body;
    
    dao.joinUser(post, function(err){
    	if(err) console.log(err.message);
    	else{
    	    console.log('user join success!');
    	    fs.mkdir(root+dir+'/'+post.name);
    	}
    });

    res.redirect('/');
});


router.post('/login', function(req, res, next){
    var post = req.body;
    
    dao.loginCheck(post, function(err, data){
        if(err){
            console.log('login fail! ' + err.message);
            res.redirect('/');
        }else{
        	req.session.user = data;
        	res.redirect('/main');
        }
    });
});

router.get('/logout', function(req, res, next){
    req.session.destroy(function(err){
        if(err) console.log('session destroy error! ' + err.message);
        else res.redirect('/');
    });
});

router.get('/main', function(req, res, next){
    sessionCheck(req.session, res);
    var user = req.session.user;
    var groupList = dao.getGroupList(user);
    
    res.render('main', {
        user : user,
        groupList : groupList
    });
});

router.get('/group', function(req, res, next){
    sessionCheck(req.session, res);
    console.log('session -> '+ req.session.user);
    var groupList = dao.getGroupList(req.session.user);
    
    res.render('group', {
        groupList : groupList
    });
});

router.get('/getRootData', function(req, res, next){
    sessionCheck(req.session, res);

    dao.getRootFile(req.session.user, function(err, fileList){
        if(err) console.log(err.message);
        else{
            res.setHeader('Content-type', 'application/json');
            res.send(fileList);
        }
    });
    
});

router.post('/getDirData', function(req, res, next){
	console.log('xxxx');
    sessionCheck(req.session, res);
    var post = req.body;
    dao.getDirData(req.session.user, post.path, function(err, fileList){
    	res.setHeader('Content-type', 'application/json');
        if(err){
            console.log(err.message);
            res.send(null);
        }else{
            //res.setHeader('Content-type', 'application/json');
            res.send(fileList);
        }
    });
});

router.get('/addGroup', function(req, res, next){
    if(!req.session.user) return false;
    
    console.log(req);
    dao.addGroup(req.param('groupName'), req.session.user, function(bool){
        if(bool) res.redirect('/main');
        else res.render('/main', {
            addGroupErr : true
        });
    });
});


router.get(dir+'/*', function(req,res,next){
    sessionCheck(req.session, res);
    var path = url.parse(req.url).pathname;
    var fileName = urlencode.decode(path.substring(dir.length, path.length));
    console.log(fileName);
    
    fs.stat(root+dir+fileName, function(err, status){
        if(err){
            console.log('File destroyed');
            return ;
        }
        var fileSender = require('../module/fileSender')(root, dir, fileName, res);

        if(status.isFile()){
            console.log('file data!');
            fileSender.sendFile();
        }else{
            console.log('directory!!!');
            fileSender.sendDir();
        }
    });
});


function sessionCheck(session, res){
    if(!session.user){
        res.redirect('/');
    }
}

module.exports = router;
