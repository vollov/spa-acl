'use strict';

var demoApp = angular.module('appModule', [ 'ngRoute', 'ngResource', 'ngCookies' ]);

demoApp.config(function($routeProvider, $locationProvider) {
	
	$routeProvider.when('/settings', {
		controller : 'VehicleCtrl',
		templateUrl : '/views/settings.html'
	}).when('/registration', {
		controller : 'RegistrationCtrl',
		templateUrl : '/views/public/registration.html'
	}).when('/login', {
		controller : 'LoginCtrl',
		templateUrl : '/views/public/login.html'
	}).when('/registration/success', {
		controller : 'RegistrationCtrl',
		templateUrl : '/views/public/reg-success.html'
	}).when('/user/:id', {
		controller : 'EditUserCtrl',
		templateUrl : '/views/user/detail.html'
	}).when('/500', {
		templateUrl : '/views/public/500.html'
	}).otherwise({
		redirectTo : '/settings'
	});
	
	$locationProvider.html5Mode(true);
});

demoApp.config(function($httpProvider) {

	var logsOutUserOn401 = function($location, $q) {
		var success = function(response) {
			return response;
		};

		var error = function(response) {
			if (response.status === 401) {
				//SessionService.unset('authenticated');
				$location.path('/login');
				return $q.reject(response);
			} else {
				return $q.reject(response);
			}
		};

		return function(promise) {
			return promise.then(success, error);
		};
	};

	$httpProvider.responseInterceptors.push(logsOutUserOn401);
});




//.when('/login', {
//	controller : 'LoginCtrl',
//	templateUrl : 'views/login.html'
//})