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

demoApp.factory('SessionService', function($cookieStore){
	return {
		get: function(key){
			return $cookieStore.get(key);
		},
		set: function(key,value){
			return $cookieStore.put(key, value);
		},
		unset: function(key){
			return $cookieStore.remove(key);
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
		console.log('[cacheSession] before response.tokenid=' + response.tokenid);
		SessionService.set('tid', response.tokenid);
		console.log("[cacheSession] after SessionService.get('tid')=" + SessionService.get('tid'));
		//SessionService.set('email', response.email);
	};

	var uncacheSession = function() {
		SessionService.unset('tid');
		console.log("[uncacheSession] after SessionService.get('tid')=" + SessionService.get('tid'));
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
					console.log('auth login good, return id=' + response.tokenid);
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
			return !(SessionService.get('tid') == undefined);
		}
	};
});

demoApp.run(function($rootScope, $location, AuthenticationService) {
	var routesThatRequireAuth = [ '/user','/settings' ];

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		
		if (_(routesThatRequireAuth).contains($location.path())
				&& !AuthenticationService.isLoggedIn()) {
			//$cookieStore.put('nextView', $location.path());
			$location.path('/login');
		}
	});
});