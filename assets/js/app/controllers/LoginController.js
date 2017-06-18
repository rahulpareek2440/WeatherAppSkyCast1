angular.module('skycast')
.controller('LoginController', [
	'$scope', 
	'$uibModalInstance',
	'UserService',
	function($scope, $uibModalInstance, UserService){
		
		$scope.user = {
			username: '',
			password: ''
		};

		$scope.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		}

		$scope.login = function(isValid){
			
			if (!isValid) return;
			
			UserService.login($scope.user)
			.then(function(response){

				$uibModalInstance.close(true);

			}, function(err){
				if (err.status >= 500){
					$scope.err = 'Internal server error.';
					return;	
				}
				
				$scope.err = err.data.err;
				$scope.user.password = '';
			});

		}

	}
]);