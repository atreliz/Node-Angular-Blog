//
// ---GENERAL SET UP AND FUNCTIONS(could be services?)
//
//var serverUrl="http://localhost:3000"; //para testeo local
var serverUrl = ""; //para produccion
var defaultPagination = 4; //This will load 5 post,default pagination




//
// ---MAIN BLOG CONTROLLER
//

function MainCtrl($scope, $http, $location, $rootScope) {
    console.log("MainCtrl loaded");
    $scope.config = {
        "title": "Alex Trebolle Blog",
        "subtitle": "This is an Angular+Node experiment",
        "description": "Wellcome to blog I hope you will find something cool"
    }

    //bring a number of post requested, order by recent
    $scope.paginatePost = function(number, page, postList) {
        var geturl = serverUrl + "/somepost?number=" + number + "&page=" + page;
        $http({
            method: 'GET',
            url: geturl,
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        success(function(data) {
            console.log("GET all post: " + JSON.stringify(data));
            $scope[postList] = data;
            $scope.actualpage = page;
        }).
        error(function(data, status) {
            console.log("GET Error");
        });
    }

    //show prev page of posts
    $scope.getNextPostGroup = function(number, page, postList) {
        console.log("getNextPostGroup");
        if (page > 0) {
            page = page - 1;
            $scope.paginatePost(number, page, postList);
        }
    };

    //show next page of posts
    $scope.getPrevPostGroup = function(number, page, postList) {
        console.log("getPrevPostGroup");
        if (page < $scope.totalpages-1) {
            page = page + 1;
            $scope.paginatePost(number, page, postList);
        }
    };

	//load a post by ID
    $scope.loadpost = function(id) { //not ready
        var loadpostUrl = serverUrl + "/postId?id=" + id;
        $http({
            method: 'GET',
            url: loadpostUrl,
            headers: {
                'Content-Type': '*/*'
            }
        }).
        success(function(data) {
            console.log("llegado en POST: " + JSON.stringify(data));
            console.log(data);
            $scope.post = data;
            //$scope.contentCss="<style type='text/css'> \r\n .postStyle{} \r\n </style>";
            $scope.sms = "Ready to edit";
        }).
        error(function(data, status) {
            console.log("GET Error: ");
        });
    };

    //load the last post(most recent)
    $scope.getLastPost = function(where) { //not ready
        var loadpostUrl = serverUrl + "/lastPost";
        $http({
            method: 'GET',
            url: loadpostUrl,
            headers: {
                'Content-Type': '*/*'
            }
        }).
        success(function(data) {
            console.log("Loading last POST: " + JSON.stringify(data));
            console.log(data);
            $scope[where] = data;
        }).
        error(function(data, status) {
            console.log("GET Error: ");
        });
    };


    //bring last post id
    $scope.getLastPostId = function() {
        var geturl = serverUrl + "/lastid";
        $http({
            method: 'GET',
            url: geturl,
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        success(function(data) {
            console.log("last post id: " + JSON.stringify(data));
            $scope.lastPostId = parseInt(data);
        }).
        error(function(data, status) {
            console.log("GET Error");
        });
    }

        //bring last post id
    $scope.postamount = function() {
        var geturl = serverUrl + "/postamount";
        $http({
            method: 'GET',
            url: geturl,
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        success(function(data) {
            console.log(data+"Posts Amount: " + parseInt(data) );
            $scope.postamountnumber = parseInt(data);
            $scope.totalpages=parseInt(parseInt(data)/4)+1;
        }).
        error(function(data, status) {
            console.log("GET Posts Amount Error");
        });
    }

    //try to login
    $scope.trylogin = function(login) { //not ready
        if (sessionStorage.getItem('logged_as')) {
            $scope.popup = false;
            $location.path("/editor");
        } else {
            var loadpostUrl = serverUrl + "/login?email=" + login.email + "&password=" + login.pass;
            $http({
                method: 'GET',
                url: loadpostUrl,
                headers: {
                    'Content-Type': '*/*'
                }
            }).
            success(function(data) {
                console.log("loged as: " + JSON.stringify(login));
                if (data === "welcome") {
                    sessionStorage.setItem('logged_as', login.email);
                    $scope.logged = false;

                    $location.path("/editor");
                    $scope.popup = false;
                } else {
                    $scope.error = "User not found";
                    $scope.logged = false;
                    sessionStorage.removeItem('logged_as');
                }
            }).
            error(function(data, status) {
                console.log("Error on login: ");
            });
        }
    };

    $scope.logout = function() { //not ready
        sessionStorage.removeItem('logged_as');
        $location.path("/");
        $scope.logged = true;
    };

    //save a comment, must be a put

    $scope.saveComment = function(data, id) {
        console.log("saving " + data);
        $http({
            method: 'PUT',
            'url': serverUrl + "/savecomment?id=" + id,
            'data': data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        success(function(data, status) {
            $scope.loadpost(id);
            console.log("Success on Saving comment");
        }).
        error(function(data, status) {
            console.log("ERROR on Saving comment");
        });

    };

    $scope.deleteComment = function(postId, commentId) {
        console.log("post: " + postId + ", commentId: " + commentId);
        var geturl = serverUrl + "/deletecomment?postId=" + postId + "&commentId=" + commentId;
        $http({
            method: 'GET',
            url: geturl,
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        success(function(data) {
            console.log("Comment deleted");
        }).
        error(function(data, status) {
            console.log("Comment deleted ERROR");
        });
    };

} //closing MainCtrl

function homeCtrl($scope, $rootScope, $http, $routeParams, $location) {
    console.log("EditorCtrl loaded");

    $scope.paginatePost(4, 0, 'postList'); //This will load 4 post
    //$scope.getLastPost('post');//This will load 1 post
    $scope.postamount();
    $scope.getLastPostId(); //?para qeu lo uso

    console.log("ID PEDIDA:" + $routeParams.postid);
    if ($routeParams.postid) {
        $scope.loadpost($routeParams.postid);
    } else {
        $scope.getLastPost('post')
    }



    //check if user is logged
    if (!sessionStorage.getItem('logged_as')) {
        $rootScope.logged = true;
    } else {
        $rootScope.logged = false;
    }

    $scope.getNextPost = function(id) {
        var loadpostUrl = serverUrl + "/getNextPost?id=" + id;
        $http({
            method: 'GET',
            url: loadpostUrl,
            headers: {
                'Content-Type': '*/*'
            }
        }).
        success(function(data) {
            console.log("Loading NEXT POST: " + JSON.stringify(data));
            console.log(data);
            //$scope.post=data;
            $location.path("/post/" + data.id);
        }).
        error(function(data, status) {
            console.log("GET NEXT POST Error: ");
        });
    };

    $scope.getPrevPost = function(id) {
        var loadpostUrl = serverUrl + "/getPrevPost?id=" + id;
        $http({
            method: 'GET',
            url: loadpostUrl,
            headers: {
                'Content-Type': '*/*'
            }
        }).
        success(function(data) {
            console.log("Loading NEXT POST: " + JSON.stringify(data));
            console.log(data);
            //$scope.post=data;
            $location.path("/post/" + data.id);
        }).
        error(function(data, status) {
            console.log("GET NEXT POST Error: ");
        });
    };



} //closing HomeCtrl





//
// ---POST EDITOR CONTROLLER
//

function EditorCtrl($scope, $http) {
    console.log("EditorCtrl loaded");

    $scope.paginatePost(defaultPagination, 0, 'postList'); //This will load 5 post,default pagination
    $scope.getLastPostId();
    $scope.postamount();
    $scope.sms = "Posts List Loaded";

    //Load a single post
    $scope.loadpost = function(id) { //not ready
        var loadpostUrl = serverUrl + "/postId?id=" + id;
        $http({
            method: 'GET',
            url: loadpostUrl,
            headers: {
                'Content-Type': '*/*'
            }
        }).
        success(function(data) {
            console.log("llegado en POST: " + JSON.stringify(data));
            console.log(data);
            $scope.post = data;
            $scope.sms = "Ready to edit";
        }).
        error(function(data, status) {
            console.log("GET Error: ");
        });
    };

    //create a new post
    $scope.newpost = function(last) {
        var now = new Date().getTime();
        var newid = parseInt(last) + 1;
        var emptypost = {
            "id": "" + newid + "",
            "category": "fill me",
            "title": "fill me",
            "dateCreated": "" + now + "",
            "dateModified": "" + now + "",
            "author": "Alex",
            "css": "<style type='text/css'> \r\n #postid-" + newid + "{} \r\n </style>",
            "content": "<p>Write your html here</p>"
        }

        $scope.post = emptypost; //load it into screen
        $scope.sms = "New Post Ready";
        console.log("NEW Empty Post Generated ");

    };

    //Save a single post,whatever is new or not
    $scope.postData = function(data) {
        console.log("saving " + data);
        $http({
            method: 'POST',
            'url': serverUrl + "/savepost",
            'data': data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        success(function(data, status) {
            $scope.sms = "Post saved";
            $scope.paginatePost(defaultPagination, 'all', 'postList'); // load again to refresh the list, add a special class to first post to make it more visible
        }).
        error(function(data, status) {
            $scope.sms = "Error on saved";
        });
        $scope.sms = "Posted";
    };



    //Delete a post
    $scope.deletepost = function(id) { //not ready
        var loadpostUrl = serverUrl + "/deleteId?id=" + id;
        $http({
            method: 'GET',
            url: loadpostUrl,
            headers: {
                'Content-Type': '*/*'
            }
        }).
        success(function(data) {
            console.log("Borrando el POST: " + JSON.stringify(data));
            console.log(data);
            $scope.post = "";
            $scope.paginatePost(defaultPagination, 'all', 'postList');
            $scope.sms = "Post Deleted";
        }).
        error(function(data, status) {
            console.log("Post Deleted-Error: ");
        });
    };

    //twitter
    var cb = new Codebird; //OPEN HERE TO MAKE TWITTER WORKING
    //developer APP "YOURKEY" and "YOURSECRET"
    //both should be on sever to be secure
    var TWkey="";
    var TWsecret=""
    cb.setConsumerKey(TWkey, TWsecret;

    $scope.twitterAsk = function() { //not ready



        cb.__call(
            "oauth_requestToken", {
                oauth_callback: "oob"
            },
            function(reply) {
                // stores it
                cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                console.log("oauth_requestToken");
                console.log(reply);
                // gets the authorize screen URL
                cb.__call(
                    "oauth_authorize", {},
                    function(auth_url) {
                        window.codebird_auth = window.open(auth_url);
                    }
                );
            }
        );
    };

    $scope.twitterJoin = function() {

        cb.__call(
            "oauth_accessToken", {
                oauth_verifier: document.getElementById("PINFIELD").value
            },
            function(reply) {
                // store the authenticated token, which may be different from the request token (!)
                cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                var data = {
                    "token": reply.oauth_token,
                    "tokenSecret": reply.oauth_token_secret
                };

                //Saving Tokens to server
                //if(sessionStorage.getItem('logged_as') ){
                var email = sessionStorage.getItem('logged_as');
                $http({
                    method: 'POST',
                    'url': serverUrl + "/savetwitterlogin?email=" + email,
                    'data': data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).
                success(function(data, status) {
                    console.log("TWITTER, Token saved");
                }).
                error(function(data, status) {
                    console.log("TWITTER, Token fail");
                });

            }
        );
    };


    $scope.twitterPOST = function(value) {
        console.log("twitterPOST: " + value);
        value = value.replace(/(<([^>]+)>)/g, ""); //html to text

        //This is not really secure
        var email = sessionStorage.getItem('logged_as');
        $http({
            method: 'GET',
            'url': serverUrl + "/twitterlogin?email=" + email,
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        success(function(data, status) {
            console.log("TWITTER, Token get");

            var cb = new Codebird;
            cb.setConsumerKey(TWkey, TWsecret);
            cb.setToken(data.token, data.tokenSecret); //this data is storaged on server

            cb.__call(
                "statuses_update", {
                    "status": value
                },
                function(reply) {

                    $scope.$apply(function() {
                        $scope.tweetstatus = "Tweeted!";
                    });
                    console.log("Tweeted");
                    console.log(reply);
                }
            );
        }).
        error(function(data, status) {
            console.log("TWITTER, Token get fail");
        });


    };



    //linkedin
    $scope.linkedinLOAD = function(value) {

        function displayProfiles(profiles) {
            $scope.linkedInData = profiles.values[0];
            console.log($scope.linkedInData);
        }

        IN.API.Profile("me").result(displayProfiles);
    }; //linkedinLOAD

    $scope.linkedinPOST = function(value) {
        IN.API.Raw("/people/~/current-status") // Update (PUT) the status
        .method("PUT")
            .body(JSON.stringify(value))
            .result(function(result) {
                console.log("Status updated");
            })
            .error(function(error) {
                console.log("Status ERROR");
            });
    }; //linkedinPOST

} //closing EditCtrl



//I NEED
//recent post to show on home, with a number parameter
//this pager will also used to paginate on edit screen
//this loop could add category in search
