'use strict';

angular.module('myApp.view1', ['ngRoute', 'ui.grid'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, $q , $http) {
	

	// get metadata
	
	loadMetadata();
	
	$scope.addLine = {
		show: false
	};
	$scope.addBtnClick = function(){
		// add validations...
		$scope.myData.push({
			machine_name: $scope.addLine.name,
			type_id: $scope.addLine.type,
			status_id: $scope.addLine.status,
			hardware_cfg: $scope.addLine.hardware,
			status_text: $scope.statusesObj[$scope.addLine.status],
			type_text: $scope.typesObj[$scope.addLine.type],


		});

		$scope.addLine = { show: false};
	};


	$scope.myData = [];


	$scope.gridOptions = {
	    enableSorting: true,

	    columnDefs: [
	      { name:'name', field: 'machine_name' },
	      { name:'type', field: 'type_text' },
	      { name:'status', field: 'status_text'},
	      { name:'hardware', field: 'hardware_cfg'}
	    ],
	    data: 'myData'
	};	

	function loadData(){
		$http.get('api/machine').then(function(data){
			
				//resolve metadata for machines
			for(let i in data.data) {
				let item = data.data[i];
				item['type_text'] = $scope.typesObj[item.type_id];
				item['status_text'] = $scope.statusesObj[item.status];

			}

			$scope.myData = data.data;
		});	
	};

	function loadMetadata(){
		var status = $http.get('api/status').then(function(data){
			$scope.statusesObj = {};
			$scope.statuses = data.data;
			for(let i in data.data) {
				let item = data.data[i];
				$scope.statusesObj[item.id] = item.status_name;
			}		
		});
		
		var type = $http.get('api/type').then(function(data){
			$scope.typesObj = {};
			$scope.types = data.data;		
			for(let i in data.data) {
				let item = data.data[i];
				$scope.typesObj[item.type_id] = item.type_name;
			}
		});

		$q.all([status, type]).then(function(){
			// after loading all metadata, get machines
			loadData();
		});
	};

});