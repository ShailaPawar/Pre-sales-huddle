var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

    .controller('AddClientCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.StartDate = new Date();

        var prospectFetched = $rootScope.prospectToUpdate;
        console.log("prospectFetched: ", prospectFetched);
        $scope.prospect = prospectFetched;
        console.log("$scope.prospect: ", $scope.prospect);
        $rootScope.addClientNotes= 0 ;
        $rootScope.addClientForm = 1;

        $scope.BUHead = [
            {
                value: 'BU2 (Salil)',
                name: 'BU2 (Salil)'
            }, {
                value: 'BU3 (Amit)',
                name: 'BU3 (Amit)'
            }, {
                value: 'BU4 (Preshit)',
                name: 'BU4 (Preshit)'
            }, {
                value: 'BU5 (Vrinda)',
                name: 'BU5 (Vrinda)'
            }, {
                value: 'BU6 (Ashutosh)',
                name: 'BU6 (Ashutosh)'
            }, {
                value: 'BU7 (Mukund)',
                name: 'BU7 (Mukund)'
            }
        ];

        $scope.Head = 'BU2 (Salil)';

        $scope.addToClient = function () {
            if ($scope.StartDate == undefined) {
                $scope.StartDate = new date();
            }
            var prospectStatus = "Prospect converted to client";
            var data = {
                ProspectID:     $rootScope.prospectToUpdate.ProspectID,
                Name:           $scope.prospect.Name,
                CreateDate:     prospectFetched.CreateDate,
                StartDate :     $scope.StartDate,
                TechStack:      prospectFetched.TechStack,
                Domain:         prospectFetched.Domain,
                DesiredTeamSize:prospectFetched.DesiredTeamSize,
                ProspectNotes:  prospectFetched.ProspectNotes ,
                ClientNotes:    $scope.notes,
                BUHead:         $scope.Head,
                TeamSize:       $scope.TeamSize,
                SalesID:        $rootScope.salesName,
                ConfCalls:      prospectFetched.ConfCalls,
                ProspectStatus: prospectStatus,
                KeyContacts:    $scope.prospect.KeyContacts,
                WebsiteURL:     $scope.prospect.WebsiteURL,
                FolderURL:      $scope.prospect.FolderURL,
                Revenue:        $scope.prospect.Revenue
            };
            console.log("data",data);
            $http.put(baseURL + 'prospect/', data = data, {
                headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
            }).success(function (data, status, headers, config) {
                    console.log('Prospect converted to Client.');
                    $("#clientAddedModal").modal({backdrop: "static"});
                    $rootScope.numberOfClient++;
                    /*$location.path('/prospects');*/
                }).error(function (data, status, headers, config) {
                    console.log('Prospect not converted to Client.');
                });
        };
        $scope.clientNotesPage = function() {
            $rootScope.nameOfProspect = $scope.prospect.Name;
            $rootScope.addClientNotes = 1;
            $rootScope.addClientForm = 0;
        };

        $scope.addToClientForm = function() {
            $rootScope.addClientNotes= 0 ;
            $rootScope.addClientForm = 1;
        };
        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/clients');
        };

        // Cancel button function
        $scope.go = function (path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    });