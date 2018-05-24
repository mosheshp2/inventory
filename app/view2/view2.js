'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', function($scope, $http) {
    $scope.input = {
        text: JSON.stringify({
            status: 1,
            message: 'CPU 30, MEM 2/16',
            hardware_cfg: '64GB SSD 16GB DDR3 ARM x64',
            software_cfg: 'Windows 10 with office 2018'
        }),
        machine_id: 3,
        btnDisabled: false,
        btnText: 'send post request'
    };
    $scope.errorText = '';

    $scope.submitPostMachine=function () {
      if(!$scope.input.btnDisabled) {
          $scope.input.btnDisabled = true;
          $scope.input.btnText = 'sending';
          $http.post(`/api/machine/${$scope.input.machine_id}`, $scope.input.text).then(function (data) {

              $scope.input.text = JSON.stringify(data && data.data);
              $scope.input.btnDisabled = false;
              $scope.input.btnText = 'send post request';

          }, function error(err) {
              $scope.input.btnText = 'Error...';

              $scope.errorText = 'Error ' + JSON.stringify( err);
              $scope.input.btnDisabled = false;
          });
      }
  };

});