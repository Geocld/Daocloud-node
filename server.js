var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');
var config = require('./config'); 

//body parser配置
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('superSecret', config.secret);

var port = process.env.PORT || 1340;

//数据库模型
var mongoose = require('mongoose');
var db = mongoose.connect(config.mongodbUri);
var models = require('./models');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//路由配置
var router = express.Router();

router.get('/hello', function(req, res) {
    res.json({ message: 'hello world' });
});

//add user
router.post('/addUser', function(req, res) {
    var user = new models.User();
    user.name = req.query.name;
    user.password = req.query.password;
    user.admin = req.query.admin;
    user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'success add user' });
    });
});
//user auth
router.post('/authenticate', function(req, res) {
    models.User.findOne({ name: req.query.name }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            //匹配密码
            if (user.password != req.query.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                //用户名和密码匹配，创建token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn : 60 * 60 * 1
                });

                res.json({
                    success: true,
                    message: 'success lognin',
                    token: token
                });
            }
        }
    });
});

//中间件2：以下接口需进行token验证
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                console.log(err)
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({ success: 'false', message: 'no token provided' });
    }
});

router.get('/', function(req, res) {
    res.json({ message: 'hello world' });
});

//other
router.route('/bears')
    //存储
    .post(function(req, res) {
        var bear = new models.Bear();
        bear.name = req.query.name;
        bear.save(function(err) {
            if (err) res.send(err);
            res.json({ message: 'success!' })
        });
    })
    //请求全部
    .get(function(req, res) {
        models.Bear.find(function(err, bears) {
            if (err) res.send(err);
            res.json(bears);
        });
    });

//带参数接口
router.route('/bears/:bear_id')
    //查询
    .get(function(req, res) {
        models.Bear.findOne({'_id': req.params.bear_id}, function(err, bear) {
            if (err) res.send(err);
            res.json(bear);
        });
    })

    //修改
    .post(function(req, res) { //或者使用.put
        models.Bear.findOne({'_id': req.params.bear_id}, function(err, bear) {
            if (err) res.send(err);
            bear.name = req.query.name;
            bear.save(function(err) {
                if (err) res.send(err);
                res.json({ maeesge: 'success!' })
            });
        });
    })

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
