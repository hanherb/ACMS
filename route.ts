const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const mongodb = require('mongodb');
const mongo = require('./src/mongo-connect');
const middle = require('./src/middleware');
const rf = require('./src/route-function');
const url = require('url');

const router = express.Router();

router.route('/').get(function(req, res) {rf.redirectIndex(req, res)});

router.route('/get-user').get(function(req, res) {rf.getUser(req, res)});

router.route('/register-user').get(function(req, res) {rf.registerUser(req, res)});

router.route('/login-user').get(function(req, res) {rf.loginUser(req, res)});

router.route('/create-user').get(function(req, res) {rf.registerUser(req, res)});

router.route('/update-user').get(function(req, res) {rf.updateUser(req, res)});

router.route('/delete-user').get(function(req, res) {rf.deleteUser(req, res)});

router.route('/check-session').get(function(req, res) {rf.checkSession(req, res)});

router.route('/list-plugin').get(function(req, res) {rf.listPlugin(req, res)});

router.route('/add-plugin').get(function(req, res) {rf.addPlugin(req, res)});

router.route('/list-blog').get(function(req, res) {rf.listBlog(req, res)});

router.route('/add-post').get(function(req, res) {rf.addPost(req, res)});

router.route('/update-post').get(function(req, res) {rf.updatePost(req, res)});

router.route('/delete-post').get(function(req, res) {rf.deletePost(req, res)});

router.route('/add-item').get(function(req, res) {rf.addItem(req, res)});

router.route('/update-item').get(function(req, res) {rf.updateItem(req, res)});

router.route('/delete-item').get(function(req, res) {rf.deleteItem(req, res)});

router.route('/buy-item').get(function(req, res) {rf.buyItem(req, res)});

router.route('/add-transaction').get(function(req, res) {rf.addTransaction(req, res)});

router.route('/add-consult').get(function(req, res) {rf.addConsult(req, res)});

router.route('/update-consult').get(function(req, res) {rf.updateConsult(req, res)});

router.route('/update-specific-consult').get(function(req, res) {rf.updateSpecificConsult(req, res)});

router.route('/update-status-consult').get(function(req, res) {rf.updateStatusConsult(req, res)});

router.route('/add-consult-date').get(function(req, res) {rf.addConsultDate(req, res)});

router.route('/add-supply').get(function(req, res) {rf.addSupply(req, res)});

router.route('/item-supplied').get(function(req, res) {rf.itemSupplied(req, res)});

router.route('/logout').get(function(req, res) {rf.logout(req, res)});

module.exports = router;