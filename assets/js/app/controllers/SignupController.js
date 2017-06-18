angular.module('skycast')
.controller('SignupController', [
	'$scope', 
	'$uibModalInstance',
	'UserService',
	function($scope, $uibModalInstance, UserService){
		
		$scope.user = {
			username: '',
			password: '',
			confirmPassword: ''
		};

		$scope.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		}

		$scope.signup = function(isValid){
			if (!isValid) return;

			UserService.signup($scope.user).then(function(response){
				$uibModalInstance.close(response);
			}, function(err){

				if (err.data.err.status >= 500){
					$scope.err = '';
					return;
				}
				
				var errs = [];

				var invalidAttributes = err.data.err.invalidAttributes;

				for (var property in invalidAttributes){
					if ( invalidAttributes.hasOwnProperty(property) ){
						invalidAttributes[property].forEach(function(obj){
							errs.push(obj.message);
						});
					}
				}
				
				$scope.errs = errs;
			});
		}
		
	}
]);