/**
 * Created by synerzip on 27/01/16.
 */

var baseURL = "http://presaleshuddle:8080/";

angular.module('PreSales-Huddle')

.controller('ProspectsCtrl', function($scope, $http, $rootScope,$location) {
    document.getElementById('signin').style.visibility='hidden';
    document.getElementById('g-signinP').style.height = '0px';
    document.getElementById('sign-out').style.visibility='visible';
    document.getElementById('prospectList').style.visibility='visible';
    document.getElementById('clientList').style.visibility='visible';
    document.getElementById('headerText').style.visibility='visible';
    document.getElementById('reports').style.visibility='visible';
    document.getElementById('notifications').style.visibility='visible';
    document.getElementById('titleText').style.display='none';

    //  search keyword by  Technology stack and domain
    $scope.searchWord = function (prospectList) {
        return (angular.lowercase(prospectList.TechStack).indexOf(angular.lowercase($scope.search) || '') !== -1  ||
        angular.lowercase(prospectList.Domain).indexOf(angular.lowercase($scope.search) || '') !== -1);
    };

    // default sorting order is by Prospect Creation Date
    $scope.orderByField = '-CreateDate';

    //  search keyword by  Technology stack and domain
    $scope.searchWord = function (prospectList) {
        return (angular.lowercase(prospectList.TechStack).indexOf(angular.lowercase($scope.search) || '') !== -1  ||
        angular.lowercase(prospectList.Domain).indexOf(angular.lowercase($scope.search) || '') !== -1 ||
        angular.lowercase(prospectList.Name).indexOf(angular.lowercase($scope.search) || '') !== -1);
    };

    $scope.saveData = function(prospect) {
        $http.get(baseURL + 'prospect/prospectid/' + prospect.ProspectID, {
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function (data, status, headers, config) {
            console.log("Single Prospect data: ", data);

            $rootScope.singleProspect = data;

            console.log(new Date($rootScope.singleProspect.CreateDate));

            $rootScope.prospectToUpdate = $rootScope.singleProspect;
            console.log("In saveData() $rootScope.prospectToUpdate:",$rootScope.prospectToUpdate, prospect.CreateDate);

            // creation date
            $rootScope.createDate = $rootScope.prospectToUpdate.CreateDate;
            $rootScope.createDate = new Date($rootScope.createDate);
            $rootScope.prospectToUpdate.CreateDate = $rootScope.createDate;

            // start date
            $rootScope.startDate = $rootScope.prospectToUpdate.StartDate.toString();
            $rootScope.startDate = $rootScope.startDate.split('T')[0];
            $rootScope.startDate = new Date($rootScope.startDate);

            $rootScope.prospectToUpdate.StartDate = $rootScope.startDate;
        }).error(function (data, status, header, config) {
            console.log("Not able to fetch Single Prospect data.");
        });
    };

    function displayProspectList() {
        //console.log("$rootScope.authenticationData: ", $rootScope.authenticationData);
        $http.get(baseURL + 'prospect/all/', {
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function (data, status, headers, config) {
            var prospectData = JSON.stringify(data);
            var prospectList = JSON.parse(prospectData);
            var numberOfProspects = prospectList.length;
            for (var i = 0; i < numberOfProspects; i++) {
                (function (index) {

                    //var callDate = new Date(prospectList[index].ConfCalls.ConfDateStart);
                    //var callStartDate = callDate.toDateString();
                    //var callStartTime = callDate.toLocaleTimeString();
                    //var date_time = callStartDate + " " + callStartTime;
                    //
                    //var timeString = callDate.toTimeString();
                    //var timeZone = timeString.split(" ");
                    //var timeZoneStr = timeZone[1] + " " + timeZone[2];
                    //
                    //var n = prospectList[index].CreateDate;
                    //n = new Date(n).toDateString();

                    prospectList[index].CreateDate = new Date(prospectList[index].CreateDate);

                    //if (angular.equals("Prospect created", prospectList[index].ProspectStatus)) {
                    //    prospectList[index].StatusColumnValue = prospectList[index].ProspectStatus + " on " + n;
                    //} else if(angular.equals("Prep call scheduled", prospectList[index].ProspectStatus)) {
                    //    prospectList[index].StatusColumnValue = prospectList[index].ProspectStatus + " for " +
                    //        date_time + " " + timeZoneStr;
                    //} else if(angular.equals("Client call scheduled", prospectList[index].ProspectStatus)) {
                    //    prospectList[index].StatusColumnValue = prospectList[index].ProspectStatus + " for " +
                    //        date_time + " " + timeZoneStr;
                    //} else if(angular.equals("Kick-off call scheduled", prospectList[index].ProspectStatus)) {
                    //    prospectList[index].StatusColumnValue = prospectList[index].ProspectStatus + " for " +
                    //        date_time + " " + timeZoneStr;
                    //}

                    //prospectList[index].StatusColumnValue = prospectList[index].ProspectStatus + " on " + n;

                    $http.get(baseURL + 'participant/prospectid/' + prospectList[i].ProspectID, {
                        headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
                    }).success(function (participantData, status, headers, config) {
                        var participantData = JSON.stringify(participantData);
                        if (JSON.parse(participantData) == null) {
                            prospectList[index].noOfVolunteers = 0;
                        }
                        else {
                            prospectList[index].noOfVolunteers = JSON.parse(participantData).length;
                        }
                    }).error(function (data, status, header, config) {
                        console.log("Not able to calculate volunteer count")
                    });

                    $http.get(baseURL + 'discussion/prospectid/' + prospectList[i].ProspectID, {
                            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
                        })
                        .success(function (discussionData, status, headers, config) {
                            var discussionData = JSON.stringify(discussionData);
                            if (JSON.parse(discussionData) == null) {
                                prospectList[index].noOfDiscussion = 0;
                            }
                            else {
                                prospectList[index].noOfDiscussion = JSON.parse(discussionData).length;
                            }
                        }).error(function (data, status, header, config) {
                        console.log("Not able to calculate Discussion count")
                    });
                }(i));
            }
            $scope.prospects = prospectList;
        }).error(function (data, status, header, config) {
        });
    }

    displayProspectList();

    $scope.volunteerProspect = function(prospect) {
        $rootScope.prospectToUpdate = prospect;
        var flag = 0;
        var numberOfVolunteer = 0;
        $http.get(baseURL + 'participant/prospectid/'+ prospect.ProspectID, {
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function(data, status, headers, config) {
            console.log (data);
            var participantData = JSON.stringify(data);
            if(JSON.parse(participantData) == null){
                numberOfVolunteer  = 0;
            }
            else{
                numberOfVolunteer = JSON.parse(participantData).length;
            }
            var volunteersList = JSON.parse(participantData);
            for(var i = 0; i < numberOfVolunteer; i++){
                if(angular.equals($rootScope.currentUser, volunteersList[i].UserID)) {
                    flag = 1;
                    alert("You have already volunteered for this prospect.")
                }
            }
            if(angular.equals(flag, 0)){
                console.log("flag" + flag);
                $location.path('/volunteer');
            }
        }).error(function(data, status, header, config) {
            console.log("not fecthed")
        });
    };

    $scope.viewModal = function(prospect) {
        $rootScope.prospectToView = prospect;
        $('#myModal').modal('show');
    };

    //  set up reminder save button
    $scope.prospectPage = function() {
        var changeStatus = "Following up every " + $scope.numberOfDays + " days";

        var data = {
            ProspectID:         $rootScope.prospectToView.ProspectID,
            Name:               $rootScope.prospectToView.Name,
            CreateDate :        $rootScope.prospectToView.CreateDate,
            TechStack:          $rootScope.prospectToView.TechStack,
            Domain:             $rootScope.prospectToView.Domain,
            DesiredTeamSize:    $rootScope.prospectToView.DesiredTeamSize,
            ProspectNotes:      $rootScope.prospectToView.ProspectNotes,
            ConfCalls:          $rootScope.prospectToView.ConfCalls,
            ProspectStatus:     changeStatus,
            SalesID:            $rootScope.prospectToView.salesName,
            StartDate:          $rootScope.prospectToView.StartDate,
            TeamSize:           $rootScope.prospectToView.TeamSize,
            ClientNotes:        $rootScope.prospectToView.ClientNotes,
            BUHead:             $rootScope.prospectToView.BUHead,
            DeadProspectNotes:  $rootScope.prospectToView.notes
        };

        console.log(data);

        $http.put(baseURL + 'prospect/', data = data, {
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function(data, status, headers, config) {
            console.log('Reminder for prospect is set.');
            //$('#myModal').modal('hide');
            //$("#myModal").modal({backdrop: "static"});
            //displayProspectList();
            $location.path('/viewProspects');
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
            console.log('Reminder for prospect is not set.');
        });

        $scope.numberOfDays = "";
        //javascript:history.go(-1);
        //$location.path('/prospects');
    };

    // checkbox handling
    $scope.checkDeadProspectState = function ($event, participant) {
        console.log("checkDeadProspectState:", $event);
        $rootScope.showDeadProspects = false;
        if ($event == true) {
            console.log("yes", $event);
            $rootScope.showDeadProspects = true;
        } else if ($event == false) {
            $rootScope.showDeadProspects = false;
        }
    };
});