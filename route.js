var express = require('express');
var app = express();
var session = require('express-session');
var jwt = require('jsonwebtoken');
var mongodb = require('mongodb');
var mongo = require('./src/mongo-connect');
var fs = require('fs');
var middle = require('./src/middleware');
var router = express.Router();
router.route('/').get(function (req, res) {
    res.redirect('/index.html');
});
//route api start here
router.route('/api/token').get(function (req, res) {
    console.log(req.token);
    jwt.verify(req.token, 'kuda', function (err, authData) {
        if (err) {
            res.json({
                error: err
            });
        }
        else {
            res.json({
                text: 'Post here',
                authData: authData
            });
        }
    });
});
router.route('/api/user').get(middle.apiAuthCheck, function (req, res) {
    mongo.mongoUser("find", {}, function (response) {
        res.json(response);
    });
});
router.route('/api/plugin').get(middle.apiAuthCheck, function (req, res) {
    mongo.mongoPlugin("find", {}, function (response) {
        res.json(response);
    });
});
router.route('/api/blog').get(middle.apiAuthCheck, function (req, res) {
    mongo.mongoBlog("find", {}, function (response) {
        res.json(response);
    });
});
//--
//mengambil data dari collection user untuk ditampilkan di dashboard.html
router.route('/get-user').get(function (req, res) {
    mongo.mongoUser("find", {}, function (response) {
        res.json(response);
    });
});
//--
router.route('/register-user').get(function (req, res) {
    var obj = {
        email: req.query.email,
        fullname: req.query.fullname,
        password: req.query.password,
        role: "user",
        authority: {
            "user": {
                "read": 0,
                "create": 0,
                "update": 0,
                "delete": 0
            },
            "api": {
                "user": 0,
                "plugin": 0
            }
        }
    };
    mongo.mongoUser("insert-one", obj, function (response) {
        res.json(response.insertedCount);
    });
});
router.route('/login-user').get(function (req, res) {
    var query = { email: req.query.email, password: req.query.password };
    mongo.mongoUser("find-query", query, function (response) {
        if (response[0]) {
            var token = jwt.sign({ user: response[0] }, 'kuda', { expiresIn: '24h' });
            res.cookie('jwtToken', token);
            req.session.email = response[0].email;
            req.session.fullname = response[0].fullname;
            req.session.role = response[0].role;
            req.session.authority = response[0].authority;
            res.json(response[0]);
        }
        else {
            res.json("Login error");
        }
    });
});
router.route('/update-user-form').get(function (req, res) {
    var query = { email: req.query.email };
    mongo.mongoUser("find-query", query, function (response) {
        res.json(response);
    });
});
router.route('/delete-user-form').get(function (req, res) {
    var query = { email: req.query.email };
    mongo.mongoUser("find-query", query, function (response) {
        res.json(response);
    });
});
router.route('/create-user').get(function (req, res) {
    var obj = {
        email: req.query.email,
        fullname: req.query.fullname,
        password: req.query.password,
        role: req.query.role,
        authority: req.query.authority
    };
    mongo.mongoUser("insert-one", obj, function (response) {
        res.json(response.insertedCount);
    });
});
router.route('/update-user').get(function (req, res) {
    var query = [{ email: req.query.email }, { $set: { fullname: req.query.fullname, role: req.query.role, authority: req.query.authority } }];
    mongo.mongoUser("update-one", query, function (response) {
        res.json(response);
    });
});
router.route('/delete-user').get(function (req, res) {
    var query = { email: req.query.email };
    mongo.mongoUser("delete-one", query, function (response) {
        res.json(response);
    });
});
router.route('/check-session').get(function (req, res) {
    if (req.session.email) {
        var query = { email: req.session.email };
        mongo.mongoUser("session", query, function (response) {
            if (response) {
                req.session.email = response[0].email;
                req.session.fullname = response[0].fullname;
                req.session.role = response[0].role;
                req.session.authority = response[0].authority;
            }
        });
        res.json(req.session);
    }
    else {
        res.json("no session");
    }
});
router.route('/list-plugin').get(function (req, res) {
    var folder = __dirname + '/plugin/';
    var temp = [];
    fs.readdir(folder, function (err, files) {
        files.forEach(function (file) {
            temp.push(file);
        });
        res.json(temp);
    });
});
router.route('/get-plugin').get(function (req, res) {
    if (req.session.email) {
        var plugin = req.query.plugin;
        var query = {};
        mongo.mongoPlugin("find", query, function (response) {
            res.json(response);
        });
    }
    else {
        res.json("No session");
    }
});
router.route('/add-plugin').get(function (req, res) {
    var plugin = req.query.plugin;
    for (var i = 0; i < plugin.name.length; i++) {
        var query = [{ name: plugin.name[i] }, { $set: { name: plugin.name[i], status: plugin.status[i] } }, { upsert: true }];
        mongo.mongoPlugin("update", query, function (response) {
        });
    }
    res.json(1);
});
router.route('/list-blog').get(function (req, res) {
    mongo.mongoBlog("find", {}, function (response) {
        res.json(response);
    });
});
router.route('/add-post').get(function (req, res) {
    var obj = {
        title: req.query.title,
        content: req.query.content,
        date: req.query.date,
        month: req.query.month,
        year: req.query.year
    };
    mongo.mongoBlog("insert-one", obj, function (response) {
        res.json(response.insertedCount);
    });
});
router.route('/update-post').get(function (req, res) {
    var query = [{ title: req.query.old }, { $set: { title: req.query.title, content: req.query.content } }];
    mongo.mongoBlog("update-one", query, function (response) {
        res.json(response);
    });
});
router.route('/delete-post').get(function (req, res) {
    var query = { title: req.query.title };
    mongo.mongoBlog("delete-one", query, function (response) {
        res.json(response);
    });
});
router.route('/logout').get(function (req, res) {
    res.clearCookie("jwtToken");
    req.session.destroy(function () {
        res.redirect('/');
    });
});
module.exports = router;
