var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

    .controller('VolunteerCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('clientList').style.visibility = 'visible';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;
        $scope.volunteerRole =
            [
                {
                    value: 'Domain advisor',
                    name: 'Domain advisor'
                },
                {
                    value: 'Technical advisor',
                    name: 'Technical advisor'
                },
                {
                    value: 'Staffing advisor',
                    name: 'Staffing advisor'
                },
                {

                    value: 'Probable team member',
                    name: 'Probable team member'
                },
                {
                    value: 'Silent listener',
                    name: 'Silent listener'
                }]
        ;
        $scope.Role = 'Domain advisor';
        $scope.domainLabel = true;
        $scope.technicalLabel = false;
        $scope.staffingLabel = false;
        $scope.teamMemberLabel = false;
        $scope.listnerLabel = false;


        $scope.changeRole = function () {
            console.log($scope.volunteerRole[3].value);

            if (angular.equals($scope.Role, $scope.volunteerRole[0].value)) {
                $scope.domainLabel = true;
                $scope.technicalLabel = false;
                $scope.staffingLabel = false;
                $scope.teamMemberLabel = false;
                $scope.listnerLabel = false;
                $scope.showDate = false;
            }

            if (angular.equals($scope.Role, $scope.volunteerRole[1].value)) {
                $scope.domainLabel = false;
                $scope.technicalLabel = true;
                $scope.staffingLabel = false;
                $scope.teamMemberLabel = false;
                $scope.listnerLabel = false;
                $scope.showDate = false;
            }

            if (angular.equals($scope.Role, $scope.volunteerRole[2].value)) {
                $scope.domainLabel = false;
                $scope.technicalLabel = false;
                $scope.staffingLabel = true;
                $scope.teamMemberLabel = false;
                $scope.listnerLabel = false;
                $scope.showDate = false;
            }

            if (angular.equals($scope.Role, $scope.volunteerRole[3].value)) {
                $scope.domainLabel = false;
                $scope.technicalLabel = false;
                $scope.staffingLabel = false;
                $scope.teamMemberLabel = true;
                $scope.listnerLabel = false;
                $scope.showDate = true;
            }

            if (angular.equals($scope.Role, $scope.volunteerRole[4].value)) {
                $scope.domainLabel = false;
                $scope.technicalLabel = false;
                $scope.staffingLabel = false;
                $scope.teamMemberLabel = false;
                $scope.listnerLabel = true;
                $scope.showDate = false;
            }
        };

        $scope.addVolunteer = function () {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                UserID: $rootScope.currentUser,
                ImageURL: $rootScope.currentUserImage,
                ParticipationRole: $scope.Role,
                AvailableDate: $scope.CreateDate,
                Notes: $scope.Notes,
                Included: "Yes"
            };
            console.log("data for volunteer",data);
            $http.post(baseURL + 'participant/', data = data, {
                headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
            }).success(function (data, status, headers, config) {
                    console.log('volunteer added.');
                    $("#myModal").modal({backdrop: "static"});
                    /*  $location.path('/prospects');*/
                }).error(function (data, status, headers, config) {
                    console.log(data, status, headers, config);
                    console.log('volunteer not added.');
                });
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/viewProspects');
        };

        // Cancel button function
        $scope.go = function (path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        };
    });