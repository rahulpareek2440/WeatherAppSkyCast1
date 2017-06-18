var skycast = angular.module('skycast', ['ui.router', 'ui.bootstrap', 'ngStorage', 'angular-loading-bar']);

skycast.config([
	'$stateProvider', '$urlRouterProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider){

		$httpProvider.interceptors.push(function($q, $injector){
			return {
				request: function(config){
					config.headers['X-Requested-With'] = 'XMLHttpRequest';

					var UserService = $injector.get('UserService');

					if ( UserService.getToken()  ){
						config.headers['Authorization'] = 'Bearer ' + UserService.getToken();
					}

					return config;
				}
			}
		});

		// unmatch url go home
		$urlRouterProvider.otherwise('/');

		// set up route
		$stateProvider
		.state('skycast', {
			url: '/',
			views: {
				'menu': {
					templateUrl: '/templates/layouts/menu.html',
					controller: 'MenuController'
				},

				'content': {
					templateUrl: '/templates/home.html',
					controller: 'HomeController'
				},

				'footer': {
					templateUrl: '/templates/layouts/footer.html'
				}
			}
		});
	}
]);

skycast.constant('API_KEY', {
	SKYCAST: 'b48639ecf2b6f734cf1c9963c168c843'
});
