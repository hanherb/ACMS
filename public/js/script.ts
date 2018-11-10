// menampilkan ke #tableUser di dashboard.html
function getUser() {
	$.get('/get-user', {}, function(data) {
		for(let i = 0; i < data.length; i++) {
			
			let fullname: string = data[i].fullname;
			let email: string = data[i].email;
			let role: string = data[i].role;

			$('#tableUser tbody').append('<tr class="tr_data">'+
				'<td>'+(i+1)+'</td>'+
				'<td>'+fullname+'</td>'+
				'<td>'+email+'</td>'+
				'<td>'+role+'</td>'+
				'<td><button class="btn btn-warning" id="update" name ="'+email+'" onclick="manageUser(this.id, this.name)">Update</button>'+
				'<button class="btn btn-danger" id="delete" name="'+email+'" onclick="manageUser(this.id, this.name)">Delete</button></td>'+
				'</tr>');
		}
	});
}
//--

// pendaftaran user dari halaman register.html
function registerUser() {
	let email: string = $('#register-email').val() as string;
	let fullname: string = $('#register-fullname').val() as string;
	let password: string = $('#register-password').val() as string;
	let repassword: string = $('#register-repassword').val() as string;

	if(password != repassword) {
		alert("Password doesn't match");
	}
	else {
		$.get('/register-user', {email: email, fullname: fullname, password: password}, function(data) {
			if(data == 1) {
				alert("Register Success");
				window.location.replace("http://localhost:3000/index.html");
			}
			else {
				alert("Register Error");
			}
		});
	}
}
//--

// login dari halaman login.html
function loginUser() {
	let email: string = $('#login-email').val() as string;
	let password: string = $('#login-password').val() as string;

	if(email == null || password == null) {
		alert("Form cannot be empty");
	}
	else {
		$.get('/login-user', {email: email, password: password}, function(data) {
			if(data) {
				alert("Login Success");
				window.location.replace("http://localhost:3000/index.html");
			}
			else {
				alert("Incorrect Credential");
			}
		});
	}
}
//--

// cek apakah ada session yang aktif atau tidak
function checkSession() {
	$.get('/check-session', {}, function(data){
		if(data.email) {
			$('.no-session').hide();
			$('.session').show();
			$('.session span').html(data.fullname);

			if(data.authority.read == 1) {
				$('.admin-session').show();
			}
		}
		else {
			$('.no-session').show();
			$('.session').hide();
		}
	});
}
//--

// setting CRUD user (trigger function ada di atribut onclick setiap button)
function manageUser(action: string, email: string) {
	$.get('/check-session', {}, function(data){
		if(action == "create") {
			if(data.authority.create == 1) {
				$('#modalCreate').modal('toggle');
			}
			else {
				alert("You don't have permission to " + action);
			}
		}
		else if(action == "update") {
			if(data.authority.update == 1) {
				$('#modalUpdate').modal('toggle');
				$('#update-email').val("");
				$('#update-fullname').val("");
				$('#update-role').val("");
				$('.checkbox input').prop('checked', false);
				$.get('/update-user-form', {email: email}, function(data2) {
					$('#update-email').val(data2[0].email);
					$('#update-fullname').val(data2[0].fullname);
					$('#update-role').val(data2[0].role);
					if(data2[0].authority.read == 1)
						$('.cb2 #cb-read').prop('checked', true);
					if(data2[0].authority.create == 1)
						$('.cb2 #cb-create').prop('checked', true);
					if(data2[0].authority.update == 1)
						$('.cb2 #cb-update').prop('checked', true);
					if(data2[0].authority.delete == 1)
						$('.cb2 #cb-delete').prop('checked', true);
				});
		}
			else {
				alert("You don't have permission to " + action);
			}
		}
		else if(action == "delete") {
			if(data.authority.delete == 1) {
				$('#modalDelete').modal('toggle');
				$.get('/delete-user-form', {email: email}, function(data2) {
					$('#delete-email').html(data2[0].email);
					$('#delete-fullname').html(data2[0].fullname);
					$('#delete-role').html(data2[0].role);
				});
			}
			else {
				alert("You don't have permission to " + action);
			}
		}
	});
}
//--

// update data user dari dashboard.html
function updateUser() {
	let email: string = $('#update-email').val() as string;
	let fullname: string = $('#update-fullname').val() as string;
	let role: string = $('#update-role').val() as string;
	let cbRead: number;
	let cbCreate: number;
	let cbUpdate: number;
	let cbDelete: number;

	if($('.cb2 #cb-read').is(':checked')) 
		cbRead = 1;
	else
		cbRead = 0;
	if($('.cb2 #cb-create').is(':checked')) 
		cbCreate = 1;
	else
		cbCreate = 0;
	if($('.cb2 #cb-update').is(':checked')) 
		cbUpdate = 1;
	else
		cbUpdate = 0;
	if($('.cb2 #cb-delete').is(':checked')) 
		cbDelete = 1;
	else
		cbDelete = 0;

	let authority = {
		read: cbRead,
		create: cbCreate,
		update: cbUpdate,
		delete: cbDelete
	}

	if(email == null || fullname == null || role == null) {
		alert("Form cannot be empty");
	}
	else {
		$.get('/update-user', {email: email, fullname: fullname, role: role, authority: authority}, function(data) {
			if(data.ok == 1) {
				alert("Update Success");
				window.location.replace("http://localhost:3000/dashboard.html");
			}
			else {
				alert("Update Error");
			}
		});
	}
}
//--

// create data user dari dashboard.html
function createUser() {
	let email: string = $('#create-email').val() as string;
	let fullname: string = $('#create-fullname').val() as string;
	let role: string = $('#create-role').val() as string;
	let password: string = $('#create-password').val() as string;
	let repassword: string = $('#create-repassword').val() as string;
	let cbRead: number;
	let cbCreate: number;
	let cbUpdate: number;
	let cbDelete: number;

	if($('.cb1 #cb-read').is(':checked')) 
		cbRead = 1;
	else
		cbRead = 0;
	if($('.cb1 #cb-create').is(':checked')) 
		cbCreate = 1;
	else
		cbCreate = 0;
	if($('.cb1 #cb-update').is(':checked')) 
		cbUpdate = 1;
	else
		cbUpdate = 0;
	if($('.cb1 #cb-delete').is(':checked')) 
		cbDelete = 1;
	else
		cbDelete = 0;

	let authority = {
		read: cbRead,
		create: cbCreate,
		update: cbUpdate,
		delete: cbDelete
	}

	if(email == null || fullname == null || role == null) {
		alert("Form cannot be empty");
	}
	else if(password != repassword) {
		alert("Password doesn't match");
	}
	else {
		$.get('/create-user', {email: email, fullname: fullname, role: role, password: password, authority: authority}, function(data) {
			if(data == 1) {
				alert("Create Success");
				window.location.replace("http://localhost:3000/dashboard.html");
			}
			else {
				alert("Create Error");
			}
		});
	}
}
//--

//delete user data dari dashboard.html
function deleteUser(){
	let email: string = $('#delete-email').html() as string;

	$.get('/delete-user', {email: email}, function(data) {
		if(data.ok == 1) {
			alert("Delete Success");
			window.location.replace("http://localhost:3000/dashboard.html");
		}
		else {
			alert("Delete Error");
		}
	});
}
//--

//setting plugin navbar
function navPlugin() {
	$.get('/get-plugin', {}, function(data) {
		console.log(data);
		for(let i = 0; i < data.length; i++) {
			if(data[i].status == 1){
				$('.plugin-nav').append('<li><a href="/'+data[i].name+'.html">'+data[i].name+'</a></li>');
			}
		}
	});
}
//--

//setting plugin list
function listPlugin() {
	$.get('/list-plugin', {}, function(data) {
		for(let i = 0; i < data.length; i++) {
			$('#plugin-list').append('<div class="checkbox cb-'+data[i]+'">'+
  				'<label><input type="checkbox" id="'+data[i]+'">'+data[i]+'</label>'+
			'</div>');
		}
	});
}
//--

function getPlugin() {
	$.get('/get-plugin', {}, function(data) {
		for(let i = 0; i < data.length; i++) {
			$('#plugin-list').find('.checkbox input').each(function(){
				if(data[i].name == this.id) {
					if(data[i].status == 1) {
						$(this).prop('checked', true);
					}
					else {
						$(this).prop('checked', false);
					}
				}
			});
		}
	});
}

//tambah plugin
function addPlugin() {
	let plugin = {
		'name': [],
		'status': []
	};
	$('#plugin-list').find('.checkbox input').each(function(){
		if($(this).is(':checked')) {
			plugin.name.push(this.id);
			plugin.status.push(1);
		}
		else {
			plugin.name.push(this.id);
			plugin.status.push(0);
		}
	});

	$.get('/add-plugin', {plugin: plugin}, function(data) {
		if(data == 1) {
			alert("Plugin Updated");
			window.location.replace("http://localhost:3000/add-plugin.html");
		}
		else {
			alert("Something went wrong");
		}
	});
}
//--

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