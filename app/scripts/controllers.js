// var baseURL = "http://172.24.212.123:8280/";
var baseURL = "http://presaleshuddle:8080/";

angular.module('PreSales-Huddle')


    .controller('ProspectsCtrl', function($scope, $http, $rootScope) {
        // default sorting order is by Prospect Creation Date
        $scope.orderByField = 'StartDate';

        $scope.saveData = function(prospect) {
            //console.log("save data.");
            console.log(prospect);
            $rootScope.prospectToUpdate = prospect;
        };

        $http.get(baseURL + 'prospect/all/').success(function(data, status, headers, config) {
            $scope.prospects = data;
        }).error(function(data, status, header, config) {
        });
    })

    .controller('AddProspectCtrl', function($scope, $http, $rootScope, $location) {
        $scope.maxDate = new Date();
        $scope.date = $scope.maxDate;
        console.log($scope.maxDate);

        $scope.addProspect = function() {

            // var mydate = $scope.date.toString();
            // var date = mydate.split('T')[0];
            // console.log(date,typeof(date));
            console.log($scope.date);
            var data = {
                Name: $scope.prospectName,
                StartDate : $scope.date,
                TechStack: $scope.techStack,
                Domain: $scope.domain,
                DesiredTeamSize: $scope.teamSize,
                Notes: $scope.notes
            };

            console.log(data);

            $http.post(baseURL + 'prospect/', data = data).success(function(data, status, headers, config) {
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
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "create";
            $location.path(path);
        }
    })

    .controller('EditProspectCtrl', function($scope, $http, $rootScope, $location) {

        var prospectFetched = $rootScope.prospectToUpdate;

        console.log("date:", prospectFetched.StartDate);
        var mydate = prospectFetched.StartDate.toString();
        var date = mydate.split('T')[0];
        console.log(date,typeof(date));
        // var mydate = new Date(prospectFetched.StartDate);
        // console.log(mydate);
        $scope.prospect = prospectFetched;
        $scope.prospect.StartDate = new Date(date);
        console.log($scope.prospect.StartDate);

        $scope.editProspect = function() {

            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                Name: $scope.prospect.Name,
                StartDate : $scope.prospect.StartDate,
                TechStack: $scope.prospect.TechStack,
                Domain: $scope.prospect.Domain,
                DesiredTeamSize: $scope.prospect.DesiredTeamSize,
                Notes: $scope.prospect.Notes
            };
            console.log(data);

            $http.put(baseURL + 'prospect/', data = data).success(function(data, status, headers, config) {
                console.log('Prospect added.');
                $location.path('/prospects');
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('Prospect Not added.');
            });
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "create";
            $location.path(path);
        }
    })

    .controller('AddDiscussionCtrl', function($scope, $http, $rootScope, $location) {
        $scope.maxDate = new Date();
        $scope.date = $scope.maxDate;
        console.log($scope.maxDate);

        $scope.addDiscussion = function() {

            // var mydate = $scope.date.toString();
            // var date = mydate.split('T')[0];
            // console.log(date,typeof(date));
            console.log($scope.date);
            var data = {
                Name: $scope.prospectName,
                StartDate : $scope.date,
                TechStack: $scope.techStack,
                Domain: $scope.domain,
                DesiredTeamSize: $scope.teamSize,
                Notes: $scope.notes
            };

            console.log(data);

            $http.post(baseURL + 'discussion/', data = data).success(function(data, status, headers, config) {
                console.log('Discussion added.');
                $location.path('/prospects');
            }).error(function(data, status, headers, config) {
                console.log('Discussion Not added.');
            });

            $scope.prospectName = "";
            $scope.date = "";
            $scope.techStack = "";
            $scope.domain = "";
            $scope.teamSize = "";
            $scope.notes = "";
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "create";
            $location.path(path);
        }
    })

