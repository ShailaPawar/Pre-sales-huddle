// var baseURL = "http://172.24.212.123:8280/";
var baseURL = "http://presaleshuddle:8280/";

angular.module('PreSales-Huddle')

  .controller('ProspectsCtrl', function($scope, $http) {
    $http.get(baseURL + 'prospect/view/')
      .success(function(data, status, headers, config) {
        $scope.prospects = data;
    }).error(function(data, status, header, config) {
    });
  })


  .controller('AddProspectCtrl', function($scope, $http, $rootScope,
      $location) {
    $scope.addProspect = function() {

      var date = $scope.date.toDateString();
      console.log(date,typeof(date));

      var data = {
        Name: $scope.prospectName,
        StartDate : date,
        TechStack: $scope.techStack,
        Domain: $scope.domain,
        DesiredTeamSize: $scope.teamSize,
        Notes: $scope.notes
      };

      console.log(data);

      $http.post(baseURL + 'prospect/add/', data = data)
        .success(function(data, status, headers, config) {
          console.log('Prospect added.');
          $location.path('/prospects');
        }).error(function(data, status, headers, config) {
          console.log('Prospect Not added.');
      });

      $scope.prospectName = "";
      $scope.date = "";
      $scope.techStack = "";
      $scope.domain = "";
      $scope.teamSize = "";
      $scope.notes = "";
    }

    // Cancel button function
    $scope.go = function(path) {
      $rootScope.lastform = "create";
      $location.path(path);
    }
  })
