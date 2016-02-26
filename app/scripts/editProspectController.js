var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

    .controller('EditProspectCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility ='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility ='visible';
        document.getElementById('prospectList').style.visibility ='visible';
        document.getElementById('clientList').style.visibility ='visible';
        document.getElementById('headerText').style.visibility ='visible';
        document.getElementById('reports').style.visibility ='visible';
        document.getElementById('notifications').style.visibility ='visible';
        document.getElementById('titleText').style.display ='none';

        $scope.maxDate = new Date();
        console.log("In EditCtrl $rootScope.prospectToUpdate: ", $rootScope.prospectToUpdate);
        $scope.prospect = $rootScope.prospectToUpdate;
        $rootScope.editProspectNotes = 0;
        //$rootScope.editContactDetails = 0;
        $rootScope.editProspectData = 1;
        $scope.revenue =
            [{
                value: 'Pre-revenue',
                name:  'Pre-revenue'
            }, {
                value: 'Revenue under $10M',
                name:  'Revenue under $10M'
            }, {
                value: 'Revenue over $10M',
                name:  'Revenue over $10M'
            }]
        ;
        $scope.PreRevenue = 'Pre-revenue';

        $scope.editProspect = function() {

            var n = $scope.prospect.CreateDate.toDateString();
            //var time = $scope.prospect.CreateDate.toLocaleTimeString();
            var status = "Prospect created on " + n;
            if (angular.equals("Prep call scheduled", $rootScope.prospectToUpdate.ProspectStatus)
                || angular.equals("Client call scheduled", $rootScope.prospectToUpdate.ProspectStatus)
                || angular.equals("Kick-off call scheduled", $rootScope.prospectToUpdate.ProspectStatus)
                || angular.equals("Dead prospect", $rootScope.prospectToUpdate.ProspectStatus)
                || angular.equals("Kick-off call scheduled", $rootScope.prospectToUpdate.ProspectStatus)
                || $rootScope.prospectToUpdate.ProspectStatus.indexOf("Following up") > -1) {
                $scope.prospect.ProspectStatus = $rootScope.prospectToUpdate.ProspectStatus;
            } else if($rootScope.prospectToUpdate.ProspectStatus.indexOf("Prospect created") > -1) {
                $scope.prospect.ProspectStatus = status;
            }

            if ( angular.equals(undefined, $scope.prospect.CreateDate)) {
                console.log("$rootScope.prospectToUpdate: ", $rootScope.prospectToUpdate);
                $scope.prospect.CreateDate = $rootScope.prospectToUpdate.CreateDate;
            }

            var data = {
                ProspectID:         $rootScope.prospectToUpdate.ProspectID,
                Name:               $scope.prospect.Name,
                CreateDate :        $scope.prospect.CreateDate,
                TechStack:          $scope.prospect.TechStack,
                Domain:             $scope.prospect.Domain,
                DesiredTeamSize:    $scope.prospect.DesiredTeamSize,
                ProspectNotes:      $scope.prospect.ProspectNotes,
                ConfCalls:          $rootScope.prospectToUpdate.ConfCalls,
                ProspectStatus:     $scope.prospect.ProspectStatus,
                SalesID:            $rootScope.salesName,
                StartDate:          $rootScope.prospectToUpdate.StartDate,
                DeadProspectNotes:  $rootScope.prospectToUpdate.DeadProspectNotes,
                KeyContacts:        $scope.prospect.KeyContacts,
                WebsiteURL:         $scope.prospect.WebsiteURL,
                FolderURL:          $scope.prospect.FolderURL,
                Revenue:            $scope.prospect.Revenue
            };
            console.log(data);

            $http.put(baseURL + 'prospect/', data = data, {
                headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
            }).success(function(data, status, headers, config) {
                    console.log('Prospect updated.');
                    $("#prospectUpdatedModal").modal({backdrop: "static"});
                }).error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                    console.log('Prospect not updated.');
                });
        };

        $scope.editProspectNote = function() {
            $rootScope.nameOfProspect = $scope.prospect.Name;
            $rootScope.editProspectNotes = 1;
            // $rootScope.editContactDetails = 0;
            $rootScope.editProspectData = 0;
        };

        $scope.goEditForm = function() {
            $rootScope.editProspectNotes = 0;
            // $rootScope.editContactDetails = 0;
            $rootScope.editProspectData = 1;
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/viewProspects');
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    });