'use strict';

demoApp.controller('RegistrationCtrl', function($scope, $location, User){
	$scope.register = function(){
		User.save($scope.user, function() {
			$location.path('/registration/success');
		});
	};
	
	$scope.gotoLogin = function(){
		$location.path('/login');
	};
});

//demoApp.contorller('VehicleCtrl', function($scope, $location, User){
//	$scope.users = User.query();
//
//	$scope.selectUser = function(row) {
//		$scope.selectedRow = row;
//	};
//});

demoApp.controller('UserCtrl', function($scope, $http, $location, User, SessionService) {
	console.log('querying users.....');
	$scope.users = User.query();

	$scope.selectUser = function(row) {
		$scope.selectedRow = row;
	};
});

demoApp.controller('EditUserCtrl', function($scope, $location, $routeParams, User ) {

	$scope.user = User.get({
		id : $routeParams.id
	});
});

demoApp.controller('LoginCtrl', function ($scope, $location, $cookieStore, AuthenticationService) {
	$scope.credentials = { username: "", password: ""};
	
	$scope.login = function() {
		//console.log('Calling login func');
		AuthenticationService.login($scope.credentials).success(function() {
			$location.path('/settings');
		});
	};
});

demoApp.controller("NavCtrl", function($scope, $location, AuthenticationService) {
	$scope.logout = function() {
		console.log('calling logout in NavCtrl.....');
		AuthenticationService.logout().success(function() {
			$location.path('/login');
		}).error(function(data, status, headers, config){
			console.log('[client] NavCtrl.logout().error() data=%j', data);
			console.log('[client] NavCtrl.logout().error() status=%j', status);
		});;
	};
});
