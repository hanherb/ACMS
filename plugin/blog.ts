//menampilkan list post pada halaman blog.html
function listBlog() {
	$.get('/list-blog', {}, function(data) {
		for(let i = 0; i < data.length; i++) {
			$('.container-post').append('<div class="post-preview">'+
	            		'<a href="post.html">'+
		              		'<h2 class="post-title">'+
		                		data[i].title+
		              		'</h2>'+
	            		'</a>'+
	            		'<p class="post-meta">Posted on '+
              				data[i].month+' '+data[i].date+', '+data[i].year+
              			'</p>'+
              			'<p class="post-content">'+
	              			data[i].content+
              			'</p>'+
              			'<a class="btn btn-primary" id="btn-update-post" name="'+data[i].title+'" onclick="formPost(this.name);">Edit Post</a>'+
	          			'<a class="btn btn-danger" id="btn-delete-post" name="'+data[i].title+'" onclick="checkDeletePost(this.name);">Delete Post</a>'+
	          			'<hr>'+
	          		'</div>');
		}
	});
}
//--

//menambah post untuk plugin blog
function addPost() {
	let title = $('#add-post-title').val() as string;
	let content = $('#add-post-content').val() as string;
	let currentdate = new Date();
	let date = currentdate.getDate();
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let month = monthNames[(currentdate.getMonth())];
	let year = currentdate.getFullYear();

	$.get('/add-post', {title: title, content: content, date: date, month: month, year: year}, function(data) {
		if(data == 1) {
			alert("Add Post Success");
			window.location.replace("http://localhost:3000/blog.html");
		}
		else {
			alert("Add Post Error");
		}
	});
}
//--

//mengambil data post pada halaman blog untuk di update dan eksekusi update
function formPost(name) {
	window.location.replace("http://localhost:3000/edit-post.html?title="+name);
}

function formPostValue() {
	let url = window.location.href.split("?title=")[1].replace(/%20/g, " ");
	$.get('/list-blog', {}, function(data) {
		for(let i = 0; i < data.length; i++) {
			if(data[i].title == url) {
				$('#update-post-title').val(data[i].title);
				$('#update-post-content').val(data[i].content);
			}
		}
	});
}

function updatePost() {
	let oldTitle = window.location.href.split("?title=")[1].replace(/%20/g, " ");
	let title = $('#update-post-title').val() as string;
	let content = $('#update-post-content').val() as string;

	$.get('/update-post', {old: oldTitle, title: title, content: content}, function(data) {
		if(data.ok == 1) {
			alert("Update Post Success");
			window.location.replace("http://localhost:3000/blog.html");
		}
		else {
			alert("Update Post Error");
		}
	});
}
//--

//menghapus post dari halaman blog
function checkDeletePost(name) {
	$('#modalDeletePost').modal('toggle');
	$('#delete-check').html(name);
}

function deletePost() {
	let title = $('#delete-check').html() as string;

	$.get('/delete-post', {title: title}, function(data) {
		if(data.ok == 1) {
			alert("Delete Post Success");
			window.location.replace("http://localhost:3000/blog.html");
		}
		else {
			alert("Delete Post Error");
		}
	});
}
//--