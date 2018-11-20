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
  		content: String,
  		date: Int,
  		month: String,
  		year: Int
  	},

  	type Mutation {
		updateBlog(title: String!, input: BlogInput): Blog,
		createBlog(input: BlogInput): Blog,
		deleteBlog(title: String!): Blog
	},

	input BlogInput {
  		title: String,
  		content: String,
  		date: Int,
  		month: String,
  		year: Int
  	}
`);

var blogs = [];
mongo.mongoBlog("find", {}, function(response) {
	for(var i = 0; i < response.length; i++)
		blogs.push(response[i]);
});

var getBlog = function(args) {
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

var updateBlogFunction = function({title, input}) {
	var blogTitle = title;
  	for(var i = 0; i < blogs.length; i++) {
	  	if(blogTitle == blogs[i].title) {
	  		blogs[i] = input;
	  		return input;
	  	}
	}
}

var createBlogFunction = function({input}) {
	blogs.push(input);
	return input;
}

var deleteBlogFunction = function({title}) {
	var blogTitle = title;
  	for(var i = 0; i < blogs.length; i++) {
	  	if(blogTitle == blogs[i].title) {
	  		blogs.splice(i, 1);
	  		return blogs[i].title;
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