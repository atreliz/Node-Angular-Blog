//
// ---GENERAL SET UP AND FUNCTIONS(could be services?)
//
//var serverUrl="http://localhost:3000"; //para testeo local
var serverUrl=""; //para produccion
var defaultPagination=5; //This will load 5 post,default pagination




//
// ---MAIN BLOG CONTROLLER
//

function MainCtrl($scope, $http,$location) {
	console.log("MainCtrl loaded");
	$scope.config={"title":"Alex Trebolle Blog","subtitle":"This is an Angular+Node experiment","description":"Wellcome to blog I hope you will find something cool"}

		//bring a number of post requested, order by recent
		$scope.paginatePost=function(number,cat,postList){
			var geturl=serverUrl+"/somepost?number="+number;
			$http({method: 'GET', url: geturl, headers: {'Content-Type':'application/json'}}).
			      success(function(data) {
			      	console.log( "GET all post: "+JSON.stringify(data) );
			      	$scope[postList]=data;
			      }).
			      error(function(data, status) {
			      	console.log("GET Error");
				  });		
		}

		$scope.loadpost=function(id){ //not ready
			var loadpostUrl=serverUrl+"/postId?id="+id;
			$http({method: 'GET', url: loadpostUrl, headers: {'Content-Type':'*/*'}}).
		      success(function(data) {
		      	console.log( "llegado en POST: "+JSON.stringify(data) );
		      	console.log( data );
		      	$scope.post=data;
		      	$scope.contentCss="<style type='text/css'></style>";
		      	$scope.sms="Ready to edit";
		      }).
		      error(function(data, status) {
		      	console.log("GET Error: ");
			  });		
		};

		//load one post
		$scope.getLastPost=function(where){ //not ready
			var loadpostUrl=serverUrl+"/lastPost";
			$http({method: 'GET', url: loadpostUrl, headers: {'Content-Type':'*/*'}}).
		      success(function(data) {
		      	console.log( "Loading last POST: "+JSON.stringify(data) );
		      	console.log( data );
		      	$scope[where]=data;
		      }).
		      error(function(data, status) {
		      	console.log("GET Error: ");
			  });		
		};


		//bring last post id
		$scope.getLastPostId=function(){
			var geturl=serverUrl+"/lastid";
			$http({method: 'GET', url: geturl, headers: {'Content-Type':'application/json'}}).
			      success(function(data) {
			      	console.log( "last post id: "+JSON.stringify(data) );
			      	$scope.lastPostId=parseInt(data);
			      }).
			      error(function(data, status) {
			      	console.log("GET Error");
				  });		
		}

//try to login
		$scope.trylogin=function(login){ //not ready
			var loadpostUrl=serverUrl+"/login?email="+login.email+"&password="+login.pass;
			$http({method: 'GET', url: loadpostUrl, headers: {'Content-Type':'*/*'}}).
		      success(function(data) {
		      	console.log( "loged as: "+JSON.stringify(login) );
		      	if(data==="welcome"){
		      		$location.path("/editor");
		      		$scope.popup=false;
		      	}else{
		      		$scope.error="User not found";
		      	}
		      	
		
		      }).
		      error(function(data, status) {
		      	console.log("Error on login: ");
			  });		
		};




}//closing MainCtrl

function homeCtrl($scope,$rootScope, $http) {
	console.log("EditorCtrl loaded");

	$scope.paginatePost(4,'all','postList');//This will load 4 post
	$scope.getLastPost('post');//This will load 1 post
	$scope.getLastPostId();

	$scope.getNextPost=function(id){
		var loadpostUrl=serverUrl+"/getNextPost?id="+id;
		$http({method: 'GET', url: loadpostUrl, headers: {'Content-Type':'*/*'}}).
	      success(function(data) {
	      	console.log( "Loading NEXT POST: "+JSON.stringify(data) );
	      	console.log( data );
	      	$scope.post=data;
	      }).
	      error(function(data, status) {
	      	console.log("GET NEXT POST Error: ");
		  });		
	};

	$scope.getPrevPost=function(id){
		var loadpostUrl=serverUrl+"/getPrevPost?id="+id;
		$http({method: 'GET', url: loadpostUrl, headers: {'Content-Type':'*/*'}}).
	      success(function(data) {
	      	console.log( "Loading NEXT POST: "+JSON.stringify(data) );
	      	console.log( data );
	      	$scope.post=data;
	      }).
	      error(function(data, status) {
	      	console.log("GET NEXT POST Error: ");
		  });		
	};

	
	
}//closing MainCtrl





//
// ---POST EDITOR CONTROLLER
//

function EditorCtrl($scope, $http) {
	console.log("EditorCtrl loaded");

	$scope.paginatePost(defaultPagination,'all','postList');//This will load 5 post,default pagination
	$scope.getLastPostId();
	$scope.sms="Post Loaded";

	//Load a single post
	$scope.loadpost=function(id){ //not ready
		var loadpostUrl=serverUrl+"/postId?id="+id;
		$http({method: 'GET', url: loadpostUrl, headers: {'Content-Type':'*/*'}}).
	      success(function(data) {
	      	console.log( "llegado en POST: "+JSON.stringify(data) );
	      	console.log( data );
	      	$scope.post=data;
	      	$scope.sms="Ready to edit";
	      }).
	      error(function(data, status) {
	      	console.log("GET Error: ");
		  });		
	};

	//create a new post
	$scope.newpost=function(last){
		var now=new Date().getTime();
		var newid=parseInt(last)+1;
		var emptypost={
			"id":""+newid+"",
			"category":"fill me",
			"title":"fill me",
			"dateCreated":""+now+"",
			"dateModified":""+now+"",
			"author":"Alex",
			"css":"<style type='text/css'></style>",
			"content":"<p>Write your html here</p>"
		}

		$scope.post=emptypost;//load it into screen
		$scope.sms="New Post Ready";
		console.log("NEW Empty Post Generated ");

	};

	//Save a single post,whatever is new or not
	$scope.postData=function(data){
		console.log("saving "+data);
		$http({method: 'POST', 'url': serverUrl+"/savepost",'data':data, headers: {'Content-Type':'application/json'}}).
	      success(function(data, status) {
	      	$scope.sms="Post saved";
	      	$scope.paginatePost(defaultPagination,'all','postList');// load again to refresh the list, add a special class to first post to make it more visible
	      }).
	      error(function(data, status) {
	      	$scope.sms="Error on saved";
		  });	
		  	$scope.sms="Poed";	
	};

	//Delete a post
		$scope.deletepost=function(id){ //not ready
		var loadpostUrl=serverUrl+"/deleteId?id="+id;
		$http({method: 'GET', url: loadpostUrl, headers: {'Content-Type':'*/*'}}).
	      success(function(data) {
	      	console.log( "Borrando el POST: "+JSON.stringify(data) );
	      	console.log( data );
	      	$scope.post="";
	      	$scope.paginatePost(defaultPagination,'all','postList');
	      	$scope.sms="Post Deleted";
	      }).
	      error(function(data, status) {
	      	console.log("Post Deleted-Error: ");
		  });		
	};





//EJEMPLO DE POST Y GET
/*
	$scope.postData=function(data){
		$http({method: 'POST', url: url,'data':data, headers: {'Content-Type':'application/json'}}).
	      success(function(data, status) {
	      	sms("POST OK ,Ready to GET");
	      	$scope.viewpost=false;
	      }).
	      error(function(data, status) {
	      	sms("POST Error: "+status);
		  });		
	}

	$scope.getData=function(data){ 
		var geturl=url+data.type+"/"+data.language;
		$http({method: 'GET', url: geturl, headers: {'Content-Type':'*'}}).
	      success(function(data) {
	      	console.log( "llegado en GET: "+JSON.stringify(data) );
	      	$scope.codeHtml=decode64(data.bodyTemplate);//
	      	$scope.codify($scope.codeHtml);
	      	$scope.viewpost=true;
	      	$scope.vista="normal"

	      	sms("GET OK , Ready to POST");
	      }).
	      error(function(data, status) {
	      	sms("GET Error: "+status);
		  });		
	}
*/
}//closing EditCtrl



//I NEED
//recent post to show on home, with a number parameter
//this pager will also used to paginate on edit screen
//this loop could add category in search


