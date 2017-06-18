angular.module('skycast')
.factory('UserService', [
	'$http',
	'$q',
	'$localStorage',
	'API_KEY',
	'$rootScope',
	function($http, $q, $localStorage, API_KEY, $rootScope){

		var userUrl = '/user';

		return {

			setToken: function(token){
				if (token){
					$localStorage.token = token;	
				} else {
					delete $localStorage.token;
				}
			},

			getToken: function(){
				return $localStorage.token;
			},

			setUser: function(user){
				if (user){
					$localStorage.user = user;
				} else {
					delete $localStorage.user;
				}
			},

			getUser: function(){
				return $localStorage.user;
			},

			login: function(credentials){
				var self = this;
				var url = userUrl + '/login';
				var deferred = $q.defer();

				$http.get(url, {params: credentials}).then(function(response){
					self.setUser(response.data.user);
					self.setToken(response.data.token);
					deferred.resolve(response);
				}, function(err){
					deferred.reject(err);
				});

				return deferred.promise;
			},

			logout: function(){
				this.setToken(null);
				this.setUser(null);
			},

			signup: function(credentials){
				var self = this;
				var url = userUrl;
				var deferred = $q.defer();

				$http.post(url, credentials).then(function(response){
					self.setUser(response.data.user);
					self.setToken(response.data.token);
					deferred.resolve(response);
				}, function(err){
					deferred.reject(err);
				});

				return deferred.promise;
			},

			isLogin: function(){
				return this.getToken();
			},

			addSearch: function(address){
				
				if ( !this.isLogin() ) return;

				var self = this;
				var url = userUrl + '/history';

				var data = {searchKey: address}

				$http.post(url, data).then(function(response){
					if (response.status == 201){
						var user = response.data.user;
						self.setUser(user);
						$rootScope.user = user;
					}
				});
			},

			getLatLng: function(address){
				var geocoder = new google.maps.Geocoder();
				var deferred = $q.defer();



				geocoder.geocode({address: address}, function(results, status){
					if (status == google.maps.GeocoderStatus.OK){
						var latLng = results[0].geometry.location;
						deferred.resolve(latLng);
					} else {
						deferred.reject(status);
					}
				});

				return deferred.promise;
			},

			getForecast: function(lat, lng){
				var url = userUrl + '/skycast';
				var params = {
					lat: lat,
					lng: lng
				};
				var deferred = $q.defer();

				$http.get(url, {params: params}).then(function(result){
					deferred.resolve(result);
				}, function(err){
					deferred.reject(err);
				});

				return deferred.promise;
			},

			getWeather: function(address){

				var deferred = $q.defer();
				var self = this;
				this.getLatLng(address).then(function(latLng){
					
					var lat = latLng.lat();
					var lng = latLng.lng();
					
					return self.getForecast(lat, lng);

				}).then(function(result){
					
					deferred.resolve(result);
					
					$rootScope.$broadcast('skycast', result);
					$rootScope.$broadcast('searchKey', address);

				}).catch(function(err){

					deferred.reject(err);

				});

				return deferred.promise;
			}
		}
	}
]);