var express = require('express');
var app = express();

var fs = require('fs');


//ALEXT
app.set("view options", {layout: false}); //added
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

app.listen(3000);
console.log('Server on: http://localhost:3000/');

//ALEXT Refactor,read one time and on edit
//Read all the post at the begining
var postList=fs.readFileSync("filesmock/postlist.json"); //storage as string
var postListJson=JSON.parse(postList); //storage as Json
var totalpost=postListJson.length;
var lastid=postListJson[totalpost-1].id;
    console.log("server Started");
    console.log("Total post= "+totalpost);
    console.log("Last post.id= "+lastid);

  var userList=fs.readFileSync("filesmock/users.json"); //storage as string
  var userListJson=JSON.parse(userList); //storage as Json    
  console.log("Available users= "+userList);



  function updateserver(){
    //renew loop
    fs.writeFileSync("filesmock/postlist.json",JSON.stringify(postListJson));
    postList=fs.readFileSync("filesmock/postlist.json"); //storage as string
    postListJson=JSON.parse(postList); //storage as Json
    totalpost=postListJson.length;
    lastid=postListJson[totalpost-1].id;
    console.log("server updated");
    console.log("Total post= "+totalpost);
    console.log("Last post.id= "+lastid);
  }

//---
//------ SERVICES ------
//----
app.get('/server', function(req, res){
  res.send('<h1>Yes,I am here Master,loaded and ready</h1>');
});


//login function

app.get('/login', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");
  console.log("asking for "+req.query.email);
  console.log("asking for "+req.query.password);

  var logMail=req.query.email;
  var logPass=req.query.password;
  var found=false;
  console.log("asking for logMail: "+logMail);
  console.log("asking for logPass:"+logPass);

  for(var i=0;i<2;i++){
    console.log("found "+userListJson[i].email);
    console.log("found "+userListJson[i].password);
  
      if(userListJson[i].email==logMail && userListJson[i].password==logPass){
         res.send("welcome");
         found=true;
         console.log("User logged "+logMail);
      }
  }
  if(found===false){
    res.send("notwelcome");
  }
});



//already not ins use
app.get('/allpost', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");
  //already readed and loaded
  res.send(postList);

  console.log("File requested: filesmock/postlist.json");
});

//last id
app.get('/lastid', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");
  //already readed and loaded
  res.send(lastid);

  console.log("Last id requested: "+lastid);
});

//get some post=pagination,order by recent
app.get('/somepost', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");

  var cat,until,somePostList, number=parseInt(req.query.number);

  if(number>=totalpost || number<=0){ until=0;} //this will prevent error from bigger or smaller numbers
  else{    until=totalpost-number;  }

   //cat=parseInt(req.query.cat);//does not matter yet

   somePostList = postListJson.slice(until,totalpost);
   res.send(somePostList);

  console.log(number+"POSTS requested,total="+totalpost+" and until="+until+"result"+somePostList);
});


//get a post by id
app.get('/postId', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");

  var id=parseInt(req.query.id);
  for(var i=0;i<totalpost;i++){
      if(postListJson[i].id==id){
         res.send(postListJson[i] );
         console.log("ONE POST requested: "+JSON.stringify(postListJson[i]) );
      }
  }
});



//get a next post postion in the array by id
app.get('/getNextPost', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");

  var id=parseInt(req.query.id);
  for(var i=0;i<totalpost;i++){
      if(postListJson[i].id==id){
         res.send(postListJson[i+1] );
         console.log("NEXT POST requested: "+JSON.stringify(postListJson[i]) );
      }
  }
});


//get a prev post postion in the array by id
app.get('/getPrevPost', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");

  var id=parseInt(req.query.id);
  for(var i=0;i<totalpost;i++){
      if(postListJson[i].id==id){ 
          res.send(postListJson[i-1] );
         console.log("NEXT POST requested: "+JSON.stringify(postListJson[i]) );
      }
  }
});





//get last post, most recent
app.get('/lastPost', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");

  var id=lastid;
  for(var i=0;i<totalpost;i++){
      if(postListJson[i].id==id){
         res.send(postListJson[i] );
         console.log("ONE POST requested: "+JSON.stringify(postListJson[i]) );
      }
  }
});

//Post a "post" to the server an save it, or edit it.
app.post('/savepost', function(req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");
  var found=false;
  var newpost=req.body;
  var id=req.body.id;
  console.log("post id= "+req.body.id);

  //if the post is new,added to boton
  //else look for it, and edit it

    for(var i=0;i<totalpost;i++){
      if(postListJson[i].id==id){
        
        postListJson[i]=newpost;
        found=true;
        console.log("Post edited");
      }
    }
    if(found===false){ //means is a new post
        postListJson.push(newpost);
        console.log("Post created");
    }

  updateserver();
  res.send("OKE DOKE");
  console.log(postListJson);
});

//Delete a post by id
app.get('/deleteId', function(req, res){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Content-Type", "application/json");

  var id=parseInt(req.query.id);
  for(var i=0;i<totalpost;i++){
      if(postListJson[i].id==id){
        postListJson.splice(i,1);
        updateserver();
         res.send("Delete OK ");
         console.log("Delete: "+postListJson[i] );
      }
  }
});


//LOGIN
/*
When login, gereta a random key as token, save it, as ask for it.
with a time out, deleted it in one hour.
*/

/*
//JUGANDO CON ESTA //ALEXT
app.get('/', function(req, res){
  res.render('index.html');
});
*/


/*


app.get('/shell/files/', function(req, res){
	var json={"entity":[{"fileTypeDTO":"FILE","url":"https://oceanos.pre.s3.amazonaws.com/BasicAuth.png?AWSAccessKeyId=AKIAJWWQFVKOALYEHQIQ&Expires=1372085368&Signature=gg0IuHS9OQS47NSC8ZXZXspdEQU%3D","fileMetaDataDTO":[{"key":"ETag","value":"\"4d4fd3b2d884158fdeeadf1c2d45bf5a\""},{"key":"Content-Length","value":"84633"},{"key":"Last-Modified","value":"Wed Jun 19 12:10:09 CEST 2013"}]},{"fileTypeDTO":"FOLDER","url":"applications/","fileMetaDataDTO":[]}]};
      //res.header("Access-Control-Allow-Origin", "*");
      ////res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send(json);
});


app.get('/shell/files/applications/', function(req, res){
	var json={"entity":[{"fileTypeDTO":"FOLDER","url":"applications/7/","fileMetaDataDTO":[]}]};
	//res.header("Access-Control-Allow-Origin", "*");
  res.send(json);
});

app.get('/shell/files/applications/7/', function(req, res){
	var json={"entity":[{"fileTypeDTO":"FILE","url":"https://oceanos.pre.s3.amazonaws.com/applications/7/BannerMails_675x100.psd?AWSAccessKeyId=AKIAJWWQFVKOALYEHQIQ&Expires=1372085765&Signature=a5CVChUi9NXVIxETiKL9QMVIfkk%3D","fileMetaDataDTO":[{"key":"ETag","value":"\"772b6cebc37a21f786c008b1978e6247\""},{"key":"Content-Length","value":"1114145"},{"key":"Last-Modified","value":"Sat Sep 22 19:05:32 CEST 2012"}]},{"fileTypeDTO":"FILE","url":"https://oceanos.pre.s3.amazonaws.com/applications/7/Logo.psd?AWSAccessKeyId=AKIAJWWQFVKOALYEHQIQ&Expires=1372085765&Signature=Q67Cmul3eW1hbgNbJgFeVayr%2BMU%3D","fileMetaDataDTO":[{"key":"ETag","value":"\"7274ef37abde7a5c517b935c98cd0d8c\""},{"key":"Content-Length","value":"765014"},{"key":"Last-Modified","value":"Sat Sep 22 19:05:32 CEST 2012"}]},{"fileTypeDTO":"FILE","url":"https://oceanos.pre.s3.amazonaws.com/applications/7/banner.png?AWSAccessKeyId=AKIAJWWQFVKOALYEHQIQ&Expires=1372085765&Signature=PZ%2Behul%2FMXInPq4AW0mnkgm8fyI%3D","fileMetaDataDTO":[{"key":"ETag","value":"\"ffb73610d9d239cf444572b17628fb0e\""},{"key":"Content-Length","value":"121829"},{"key":"Last-Modified","value":"Sat Sep 22 19:05:32 CEST 2012"}]},{"fileTypeDTO":"FILE","url":"https://oceanos.pre.s3.amazonaws.com/applications/7/icon.png?AWSAccessKeyId=AKIAJWWQFVKOALYEHQIQ&Expires=1372085765&Signature=rCY%2BBTOkfrdLQeK%2BvM%2B14dhyLJI%3D","fileMetaDataDTO":[{"key":"ETag","value":"\"d86a8a4a35de5a9c9111c01c60a74228\""},{"key":"Content-Length","value":"22391"},{"key":"Last-Modified","value":"Sat Sep 22 19:05:32 CEST 2012"}]},{"fileTypeDTO":"FILE","url":"https://oceanos.pre.s3.amazonaws.com/applications/7/logo.png?AWSAccessKeyId=AKIAJWWQFVKOALYEHQIQ&Expires=1372085765&Signature=LNcc38GVShnKJ163IJO5B%2BwkYR0%3D","fileMetaDataDTO":[{"key":"ETag","value":"\"b2b4b72913d93ede50b237c6348c5f10\""},{"key":"Content-Length","value":"146818"},{"key":"Last-Modified","value":"Sat Sep 22 19:05:31 CEST 2012"}]}]};
  //res.header("Access-Control-Allow-Origin", "*");
  res.send(json);
});

//oceanos-pre.glass.u-tad.com/shell/files/applications/
*/


