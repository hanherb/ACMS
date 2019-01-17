var mongodb = require('mongodb');
var mongo = require('../../src/mongo-connect');
var {buildSchema} = require('graphql');

exports.schema = buildSchema(`
	type Query {
		blog(_id: String!): Blog,
		blogs: [Blog]
	},

	type Blog {
		_id: String,
  		title: String,
  		content: String,
  		date: Int,
  		month: String,
  		year: Int,
  		author: String
  	},

  	type Mutation {
		updateBlog(_id: String!, input: BlogInput): Blog,
		createBlog(input: BlogInput): Blog,
		deleteBlog(_id: String!): Blog
	},

	input BlogInput {
		_id: String,
  		title: String,
  		content: String,
  		date: Int,
  		month: String,
  		year: Int,
  		author: String
  	}
`);

var blogs = [];
mongo.mongoBlog("find", {}, function(response) {
	for(var i = 0; i < response.length; i++) {
		response[i]._id = response[i]._id.toString();
		blogs.push(response[i]);
	}
});

var getBlog = function(args) {
	var blogId = args._id;
  	for(var i = 0; i < blogs.length; i++) {
	  	if(blogId == blogs[i]._id) {
	  		return blogs[i];
	  	}
	}
}

var getBlogs = function() {
	return blogs;
}

var updateBlogFunction = function({_id, input}) {
	var blogId = _id;
  	for(var i = 0; i < blogs.length; i++) {
	  	if(blogId == blogs[i]._id) {
	  		var oldAuthor = blogs[i].author;
	  		blogs[i] = input;
	  		blogs[i].author = oldAuthor;
	  		return input;
	  	}
	}
}

var createBlogFunction = function({input}) {
	blogs.push(input);
	// blogs = [];
	// mongo.mongoBlog("find", {}, function(response) {
	// 	for(var i = 0; i < response.length; i++) {
	// 		response[i]._id = response[i]._id.toString();
	// 		blogs.push(response[i]);
	// 	}
	// });
	return input;
}

var deleteBlogFunction = function({_id}) {
	var blogId = _id;
  	for(var i = 0; i < blogs.length; i++) {
	  	if(blogId == blogs[i]._id) {
	  		blogs.splice(i, 1);
	  		return blogs[i]._id;
	  	}
	}
}

exports.root = {
	blog: getBlog,
	blogs: getBlogs,
	updateBlog: updateBlogFunction,
	createBlog: createBlogFunction,
	deleteBlog: deleteBlogFunction
};