var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

    .controller('ViewProspectCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;
        $rootScope.viewProspectNotes = 0;
        $rootScope.viewParticularPropsectDetails = 1;
        // $rootScope.viewContactDetails = 0;

        $scope.viewProspectNote = function() {
            $rootScope.nameOfProspect = $scope.prospect.Name;
            $rootScope.viewProspectNotes = 1;
            $rootScope.viewParticularPropsectDetails = 0;
            //$rootScope.viewContactDetails = 0;
        };

        $scope.goToViewForm = function() {
            $rootScope.viewProspectNotes = 0;
            $rootScope.viewParticularPropsectDetails = 1;
            // $rootScope.viewContactDetails = 0;

        };

        /* $scope.viewContacts = function() {
         $rootScope.viewProspectNotes = 0;
         $rootScope.viewParticularPropsectDetails = 0;
         $rootScope.viewContactDetails = 1;

         };*/
        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        };
    });