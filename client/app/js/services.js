'use strict';

var api_url_root = 'http://localhost:5002';

demoApp.factory('User', function($resource, SessionService) {
	var tokenid = SessionService.get('tid');
	console.log('sending tid in service =' + tokenid);
	return $resource(api_url_root + '/api/users/:id', {id: '@id', tid: tokenid}, {
		update: {method:'PUT'},
		save:   {method:'POST', url: api_url_root + '/public/users'},
	});
});

demoApp.factory('SessionService', function(){
	return {
		get: function(key){
			return sessionStorage.getItem(key);
		},
		set: function(key,value){
			return sessionStorage.setItem(key, value);
		},
		unset: function(key){
			return sessionStorage.removeItem(key);
		}
	};
});

demoApp.factory("FlashService", ['$rootScope', function($rootScope) {
	return {
		set: function(message) {
			$rootScope.flash = message;
		},
		clear: function() {
			$rootScope.flash = "";
		},
		get: function(){
			return $rootScope.flash;
		}
	}
}]);

demoApp.factory('AuthenticationService', function($http, $location,
		SessionService, FlashService) {
	var cacheSession = function(response) {
		//console.log('cacheSession response.tokenid=' + response.tokenid);
		SessionService.set('tid', response.tokenid);
		//SessionService.set('email', response.email);
	};

	var uncacheSession = function() {
		SessionService.unset('tid');
		//SessionService.unset('email');
	};

	var loginError = function(response) {
		//console.log('calling AuthenticationService.loginError!');
		FlashService.set(response.message);
	};

	return {
		login : function(credentials) {
			return $http.post(api_url_root + '/public/login', credentials).
			success(function(response,status){
				if(status == 200){
					//console.log('auth login good, return id=' + response.tokenid);
					cacheSession(response);
					FlashService.clear();
				}else{
					loginError(response);
				}
			}).
			error(function(response,status){
				loginError(response);
			});
		},
		logout : function() {
			var tokenid = SessionService.get('tid');
			var logout = $http.get(api_url_root + '/api/logout',
					{params: {tid: tokenid}});
			logout.success(uncacheSession);
			return logout;
		},
		isLoggedIn : function() {
			return !(SessionService.get('tid') == null);
		}
	};
});

demoApp.run(function($rootScope, $location, $cookieStore, AuthenticationService) {
	var routesThatRequireAuth = [ '/users','/settings' ];

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		
		if (_(routesThatRequireAuth).contains($location.path())
				&& !AuthenticationService.isLoggedIn()) {
			//$cookieStore.put('nextView', $location.path());
			$location.path('/login');
		}
	});
});