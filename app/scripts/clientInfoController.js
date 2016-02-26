var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

    .controller('ClientInfoCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.prospect = $rootScope.prospectToUpdate;
        console.log("$scope.prospect: ", $scope.prospect);
        $rootScope.showParticularClient = 1;
        $rootScope.showClientNotes = 0;

        $scope.viewClientNotes = function() {
            $rootScope.nameOfProspect = $scope.prospect.Name;
            $rootScope.showParticularClient = 0;
            $rootScope.showClientNotes = 1;
        };
        $scope.goToViewForm = function() {
            $rootScope.showParticularClient = 1;
            $rootScope.showClientNotes = 0;
        };

        // back button function
        $scope.go = function (path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);

            //javascript:history.go(-1);
        }
    });