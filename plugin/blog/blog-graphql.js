var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		blog(title: String!): Blog,
		blogs: [Blog]
	},

	type Blog {
  		title: String,
  		content: String
  	}
`);

var blogs = [];
mongo.mongoBlog("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		blogs.push(response[i]);
});

var getBlog = function(args) { // return a single user based on id
	var blogTitle = args.title;
  	for(var i = 0; i < blogs.length; i++) {
	  	if(blogTitle == blogs[i].title) {
	  		return blogs[i];
	  	}
	}
}

var getBlogs = function() {
	return blogs;
}

exports.root = {
	blog: getBlog,
	blogs: getBlogs
};