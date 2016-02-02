/**
 * Created by synerzip on 12/01/16.
 */

var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";

angular.module('PreSales-Huddle')

    .controller('DeadProspectCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.deadProspect = function() {
            var status = "Dead prospect";

            var data = {
                ProspectID:         $rootScope.prospectToUpdate.ProspectID,
                Name:               $rootScope.prospectToUpdate.Name,
                CreateDate :        $rootScope.prospectToUpdate.CreateDate,
                TechStack:          $rootScope.prospectToUpdate.TechStack,
                Domain:             $rootScope.prospectToUpdate.Domain,
                DesiredTeamSize:    $rootScope.prospectToUpdate.DesiredTeamSize,
                ProspectNotes:      $rootScope.prospectToUpdate.ProspectNotes,
                ConfCalls:          $rootScope.prospectToUpdate.ConfCalls,
                ProspectStatus:     status,
                /*SalesID:            $rootScope.prospectToUpdate.salesName,*/
                /*SalesID:            $rootScope.prospectToUpdate.SalesID,*/
                SalesID:            $rootScope.salesName,
                StartDate:          $rootScope.prospectToUpdate.StartDate,
                TeamSize:           $rootScope.prospectToUpdate.TeamSize,
                ClientNotes:        $rootScope.prospectToUpdate.ClientNotes,
                BUHead:             $rootScope.prospectToUpdate.BUHead,
                DeadProspectNotes:  $scope.notes,
                KeyContacts:        $rootScope.prospectToUpdate.KeyContacts,
                WebsiteURL:         $rootScope.prospectToUpdate.WebsiteURL,
                FolderURL:          $rootScope.prospectToUpdate.FolderURL,
                Revenue:            $rootScope.prospectToUpdate.Revenue

            };

            console.log(data);

            $http.put(baseURL + 'prospect/', data = data, {
                headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
            }).success(function(data, status, headers, config) {
                console.log('Prospect is dead.');
                $("#myModal").modal({backdrop: "static"});
                /* $location.path('/prospects');*/
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('Prospect is not date.');
            });
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/prospects');
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "deadProspect";
            $location.path(path);
        }
    });
