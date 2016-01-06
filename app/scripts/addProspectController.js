var baseURL = "http://presaleshuddle:8080/";

angular.module('PreSales-Huddle')

    .controller('AddProspectCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        $scope.maxDate = new Date();
        $scope.date = $scope.maxDate;

        $scope.addProspect = function() {
            if ($scope.date == undefined) {
                console.log("undefined $scope.createDate: ", $scope.date);
                $scope.date = new Date();
            }
            var n = $scope.date.toDateString();
            var time = $scope.date.toLocaleTimeString();
            var status = "Prospect created on " + n;
                //+ ' ' + time;
            // creationDate.toLocaleString('en-US');
            var data = {
                Name:               $scope.prospectName,
                CreateDate :        $scope.date,
                TechStack:          $scope.techStack,
                Domain:             $scope.domain,
                DesiredTeamSize:    $scope.teamSize,
                ProspectNotes:      $scope.notes,
                ProspectStatus:     status,
                SalesID:            $rootScope.salesName
            };

            console.log(data);
            $http.post(baseURL + 'prospect/', data = data).success(function(data, status, headers, config) {
                console.log('Prospect added.');
                $location.path('/prospects');
            }).error(function(data, status, headers, config) {
                console.log('Prospect not added.');
            });

            $scope.prospectName = "";
            $scope.date = "";
            $scope.techStack = "";
            $scope.domain = "";
            $scope.teamSize = "";
            $scope.ProspectNotes = "";
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "create";
            $location.path(path);
        }
    })