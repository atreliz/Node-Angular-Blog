/* App Module */



angular.module('nodeblog', []).
  config(['$routeProvider', '$httpProvider', function ($routeProvider,$httpProvider) {
  	//delete $httpProvider.defaults.headers.common["X-Requested-With"];
  	$routeProvider.
      when('/', {templateUrl: 'views/home.html',   controller: homeCtrl}).
      when('/editor', {templateUrl: 'views/editor.html',   controller: EditorCtrl}).
      //when('/phones/:phoneId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}).
      otherwise({redirectTo: '/'});
}]);




//home principal
//un solo post

