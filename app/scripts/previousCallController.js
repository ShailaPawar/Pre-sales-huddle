
var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";

angular.module('PreSales-Huddle')

    .controller('previousCallController', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        var currentProspect = $rootScope.prospectToUpdate;
        console.log("current prospect:", currentProspect);
        $scope.prospect = $rootScope.prospectToUpdate;

        $http.get(baseURL + 'prospect/prospectid/' + $rootScope.prospectToUpdate.ProspectID,  {
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function (data, status, headers, config) {
            console.log("Single Prospect data: ", data);
            $rootScope.prospectToViewCallDetails = data ;
            console.log("$rootScope.prospectToViewCallDetails: ", $rootScope.prospectToViewCallDetails);
            $scope.previousCallDetails = $rootScope.prospectToViewCallDetails.ConfCalls;
            $scope.previousCallDetails = JSON.stringify($scope.previousCallDetails);
            $scope.previousCallDetails = JSON.parse($scope.previousCallDetails);
            console.log("$scope.previousCallDetails ", $scope.previousCallDetails);
            var previousCallDetailsLength = $scope.previousCallDetails.length;
            console.log("previousCallDetailsLength",previousCallDetailsLength);
                if (previousCallDetailsLength == 0){
                    $rootScope.noPreviousCalls = 1;
                }
                else{
                    $rootScope.noPreviousCalls = 0;
                    for(var i = 0 ; i < previousCallDetailsLength ; i++){
                        var date = new Date($scope.previousCallDetails[i].ConfDateStart);
                        var n = date.toDateString();
                        var time = date.toLocaleTimeString();
                        var date_time = n + " " + time;

                        //console.log("length: ", date.toTimeString(), date.toTimeString().length);

                        var timeString = date.toTimeString();
                        var timeZone = timeString.split(" ");
                        var timeZoneStr = timeZone[1] + " " + timeZone[2];
                        //console.log("timeZoneStr: ", timeZoneStr);
                        $scope.previousCallDetails[i].ConfDateStart = date_time + " " + timeZoneStr;
                    }

                }



/*
            for(var i = 0 ; i < previousCallDetailsLength ; i++){
                var date = new Date($scope.previousCallDetails[i].ConfDateStart);
                var n = date.toDateString();
                var time = date.toLocaleTimeString();
                var date_time = n + " " + time;

                //console.log("length: ", date.toTimeString(), date.toTimeString().length);

                var timeString = date.toTimeString();
                var timeZone = timeString.split(" ");
                var timeZoneStr = timeZone[1] + " " + timeZone[2];
                //console.log("timeZoneStr: ", timeZoneStr);
                $scope.previousCallDetails[i].ConfDateStart = date_time + " " + timeZoneStr;
            }*/
            $scope.previousCalls = $scope.previousCallDetails;
            console.log("")
        }).error(function (data, status, header, config) {
                console.log("Not able to fetch Single Prospect data.");
        })



        $scope.goBack = function() {
           $location.path('/viewProspects');
        };

        $scope.scheduleCall = function() {
            $location.path('/scheduleCall');
        };

        /*// Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "deadProspect";
            $location.path(path);
        }*/
    });
