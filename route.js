var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var jwt = require('jsonwebtoken');
var mongodb = require('mongodb');
var mongo = require('./src/mongo-connect');
var fs = require('fs');
var middle = require('./src/middleware');
var rf = require('./src/route-function');
var router = express.Router();
router.route('/').get(function (req, res) {
    res.redirect('http://localhost:3001/');
});
router.route('/get-user').get(function (req, res) {
    mongo.mongoUser("find", {}, function (response) {
        res.json(response);
    });
});
router.route('/register-user').get(function (req, res) {
    var obj = rf.registerUser(req);
    mongo.mongoUser("insert-one", obj, function (response) {
        res.json(response.insertedCount);
    });
});
router.route('/login-user').get(function (req, res) {
    var query = { email: req.query.email, password: req.query.password };
    mongo.mongoUser("find-query", query, function (response) {
        if (response[0]) {
            var token = rf.jwtSign(response[0]);
            res.cookie('jwtToken', token);
            rf.assignSession(req, res, response[0]);
            console.log(req.session);
            res.json(response[0]);
        }
        else {
            res.json("Login error");
        }
    });
});
router.route('/create-user').get(function (req, res) {
    var obj = rf.registerUser(req);
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
                rf.assignSession(req, res, response[0]);
            }
        });
        console.log(req.session);
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
    var obj = rf.addPost(req);
    mongo.mongoBlog("insert-one", obj, function (response) {
        res.json(response);
    });
});
router.route('/update-post').get(function (req, res) {
    var query = [{ title: req.query.old }, { $set: { title: req.query.title, content: req.query.content, date: req.query.date, month: req.query.month, year: req.query.year } }];
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
