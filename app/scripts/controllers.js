// var baseURL = "http://172.24.212.123:8280/";
var baseURL = "http://presaleshuddle:8080/";

angular.module('PreSales-Huddle')

    .controller('GoogleSignInCtrl', function($scope, $rootScope, $http, $location) {
        function googleLogin(){
            var auth2 = gapi.auth2.getAuthInstance();
            return auth2.signIn();
        }

        $scope.onSignIn = function() {
            googleLogin()
                .then(function (data) {
                    window.location = '#/prospects';
                    document.getElementById('signin').style.visibility='hidden';
                    document.getElementById('g-signinP').style.height = '0px';
                    document.getElementById('sign-out').style.visibility='visible';
                    document.getElementById('prospectList').style.visibility='visible';
                    document.getElementById('clientList').style.visibility='visible';
                    document.getElementById('headerText').style.visibility='visible';
                    document.getElementById('reports').style.visibility='visible';
                    document.getElementById('titleText').style.display='none';

                    //$rootScope.user;
                    // The ID token you need to pass to your backend:
                    $rootScope.id_token = data.getAuthResponse().id_token;
                    console.log("ID Token: " + $rootScope.id_token);

                    var profile = data.getBasicProfile();
                    $rootScope.currentUser = profile.getEmail();
                    $rootScope.currentUserImage = profile.getImageUrl();
                    $rootScope.salesName = profile.getName();


                    var assignRole;
                    var salesPersons = ["shaila.pawar@synerzip.com"];
                    for (i = 0; i < salesPersons.length; i++) {
                        if (angular.equals($rootScope.currentUser, salesPersons[i])) {
                            assignRole = "Sales";
                        } else {
                            assignRole = "Engineer";
                        }
                    }

                    function addUser() {
                        var data = {
                            Email: $rootScope.currentUser,
                            Role: assignRole
                        };
                        $http.post(baseURL + 'user/', data = data).success(function(data, status, headers, config) {
                            console.log('user added.');
                        }).error(function(data, status, headers, config) {
                            console.log('user not added.');
                        });
                    }

                    $http.get(baseURL + 'user/all/').success(function(data, status, headers, config) {
                        console.log ("all user :" ,data);
                        if (data != undefined) {
                            var allUsers = JSON.stringify(data);
                            var totalUsers = JSON.parse(allUsers).length;
                            allUsers = JSON.parse(allUsers);
                            for (var i = 0; i < totalUsers; i++) {
                                if (angular.equals($rootScope.currentUser, allUsers[i].Email)) {
                                    //flag = 1;
                                    $rootScope.role = allUsers[i].Role;
                                    console.log("user already exists", $rootScope.currentUser, $rootScope.role);
                                    //break;
                                } else {
                                    addUser();
                                }
                            }
                        } else {
                            addUser();
                        }

                        if (angular.equals("Engineer", $rootScope.role)) {
                            $rootScope.user = 0;
                            console.log($rootScope.user);
                        } else {
                            $rootScope.user = 1;
                            console.log($rootScope.user);
                        }
                    }).error(function(data, status, headers, config) {
                        console.log('problem in user.');
                    });

                    //user role code finish
                }, function (err) {
                    console.log(err)
                });
        };
    })

    .controller('SignOutCtrl', function($scope, $rootScope, $location) {
        function LogOut() {
            var auth2 = gapi.auth2.getAuthInstance();
            return auth2.signOut();
        }

        $scope.signOut = function() {
            LogOut()
                .then(function() {
                    console.log('User signed out.');
                    window.location = '#';
                    window.location.reload();
                    document.getElementById('signin').style.visibility = 'visible';
                    document.getElementById('g-signinP').style.removeProperty('height');
                    document.getElementById('sign-out').style.visibility = 'hidden';
                    document.getElementById('prospectList').style.visibility = 'hidden';
                    document.getElementById('clientList').style.visibility='hidden';
                    document.getElementById('reports').style.visibility='hidden';
		            document.getElementById('headerText').style.visibility='visible';
                    document.getElementById('titleText').style.display='none';
                });
        };
    })

    .controller('ProspectsCtrl', function($scope, $http, $rootScope,$location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        //  search keyword by  Technology stack and domain
        $scope.searchWord = function (prospectList) {
            return (angular.lowercase(prospectList.TechStack).indexOf(angular.lowercase($scope.search) || '') !== -1  ||
                angular.lowercase(prospectList.Domain).indexOf(angular.lowercase($scope.search) || '') !== -1);
        };

        // default sorting order is by Prospect Creation Date
        $scope.orderByField = 'CreateDate';

        //  search keyword by  Technology stack and domain
        $scope.searchWord = function (prospectList) {
            return (angular.lowercase(prospectList.TechStack).indexOf(angular.lowercase($scope.search) || '') !== -1  ||
            angular.lowercase(prospectList.Domain).indexOf(angular.lowercase($scope.search) || '') !== -1);
        };

        $scope.saveData = function(prospect) {
            console.log(prospect);
            $rootScope.prospectToUpdate = prospect;
            console.log($rootScope.prospectToUpdate);

            // creation date
            $rootScope.createDate = $rootScope.prospectToUpdate.CreateDate.toString();
            $rootScope.createDate = $rootScope.createDate.split('T')[0];
            $rootScope.createDate = new Date($rootScope.createDate);

            $rootScope.prospectToUpdate.CreateDate = $rootScope.createDate;

            // start date
            $rootScope.startDate = $rootScope.prospectToUpdate.StartDate.toString();
            $rootScope.startDate = $rootScope.startDate.split('T')[0];
            $rootScope.startDate = new Date($rootScope.startDate);

            $rootScope.prospectToUpdate.StartDate = $rootScope.startDate;

        };

        $http.get(baseURL + 'prospect/all/').success(function(data, status, headers, config) {
            var prospectData = JSON.stringify(data);
            var prospectList = JSON.parse(prospectData);
            var numberOfProspects = prospectList.length;
            for(var i = 0; i < numberOfProspects; i++){
                (function (index) {
                    $http.get(baseURL + 'participant/prospectid/'+prospectList[i].ProspectID)
                        .success(function(participantData, status, headers, config){
                            var participantData = JSON.stringify(participantData);
                            if(JSON.parse(participantData) == null){
                                prospectList[index].noOfVolunteers = 0;
                            }
                            else{
                                prospectList[index].noOfVolunteers = JSON.parse(participantData).length;
                            }
                        }).error(function(data, status, header, config) {
                            console.log("Not able to calculate volunteer count")
                            });

                    $http.get(baseURL + 'discussion/prospectid/'+prospectList[i].ProspectID)
                        .success(function(discussionData, status, headers, config){
                            var discussionData = JSON.stringify(discussionData);
                            if(JSON.parse(discussionData) == null){
                                prospectList[index].noOfDiscussion = 0;
                            }
                            else{
                                prospectList[index].noOfDiscussion = JSON.parse(discussionData).length;
                            }
                        }).error(function(data, status, header, config) {
                            console.log("Not able to calculate Discussion count")
                        });
                }(i));
            }
            $scope.prospects = prospectList;
            console.log("prospectList",prospectList);
            console.log("all $scope.prospects",$scope.prospects);

        }).error(function(data, status, header, config) {});


        $scope.volunteerProspect = function(prospect) {
            $rootScope.prospectToUpdate = prospect;
            var flag = 0;
            var numberOfVolunteer = 0;
            $http.get(baseURL + 'participant/prospectid/'+ prospect.ProspectID).success(function(data, status, headers, config) {
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

    })

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
        var creationDate = $scope.date;

        $scope.addProspect = function() {
            var status = "Prospect created on " + creationDate.toLocaleString('en-US');
            var data = {
                Name: $scope.prospectName,
                CreateDate : creationDate,
                TechStack: $scope.techStack,
                Domain: $scope.domain,
                DesiredTeamSize: $scope.teamSize,
                ProspectNotes: $scope.notes,
                ProspectStatus: status
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

    .controller('EditProspectCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
	    document.getElementById('headerText').style.visibility='visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;

        $scope.editProspect = function() {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                Name: $scope.prospect.Name,
                CreateDate : $scope.prospect.CreateDate,
                TechStack: $scope.prospect.TechStack,
                Domain: $scope.prospect.Domain,
                DesiredTeamSize: $scope.prospect.DesiredTeamSize,
                ProspectNotes: $scope.prospect.ProspectNotes,
                ConfCalls: $rootScope.prospectToUpdate.ConfCalls,
                ProspectStatus: $rootScope.prospectToUpdate.ProspectStatus
            };
            console.log(data);

            $http.put(baseURL + 'prospect/', data = data).success(function(data, status, headers, config) {
                console.log('Prospect updated.');
                $location.path('/prospects');
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('Prospect not updated.');
            });
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })

    .controller('DiscussionsCtrl', function($scope, $http, $rootScope,$location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

        var prospect = $rootScope.prospectToUpdate;
        $http.get(baseURL + 'discussion/prospectid/'+ prospect.ProspectID).success(function(data, status, headers, config) {
            console.log("discussion/prospectid/", data);
            $scope.discussions = data;
        }).error(function (data, status, header, config) {});

        $scope.addDiscussion = function() {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                UserID: $rootScope.salesName,
                Query: $scope.query
            };
            console.log("addDiscussion", data);
            $http.post(baseURL + 'discussion/', data = data).success(function (data, status, headers, config) {
                console.log('Discussion added.');
                $location.path('/discussions');
            }).error(function (data, status, headers, config) {
                console.log('Discussion not added.');
            });

            $scope.query = "";

            javascript:history.go(-1);
        }

        $scope.showDiscussion = function (discussion) {
            console.log("showdiscussion: ", discussion);
            $rootScope.discussionToView = discussion;
            console.log("$rootScope.discussionToView: ", $rootScope.discussionToView);
        };

    })

        //addTOClientCtrl to add prospect to client
    .controller('AddClientCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.maxDate = new Date();
        $scope.StartDate = $scope.maxDate;

        var prospectFetched = $rootScope.prospectToUpdate;
        $scope.prospect = prospectFetched;

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
                            },
                            {
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
            var data = {
                ProspectID:     $rootScope.prospectToUpdate.ProspectID,
                Name:           $scope.prospect.Name,
                CreateDate:     $scope.CreateDate,
                StartDate :     $scope.StartDate,
                TechStack:      $scope.prospect.TechStack,
                Domain:         $scope.prospect.Domain,
                DesiredTeamSize:$scope.prospect.DesiredTeamSize,
                ProspectNotes:  $scope.prospect.ProspectNotes ,
                ClientNotes:    $scope.prospect.ClientNotes,
                BUHead:         $scope.Head,
                TeamSize:       $scope.TeamSize,
                SalesID:        $rootScope.salesName,
                ConfCalls:      $rootScope.prospectToUpdate.ConfCalls,
                ProspectStatus: $rootScope.prospectToUpdate.ProspectStatus
            };

            $http.put(baseURL + 'prospect/', data = data).success(function (data, status, headers, config) {
                console.log('Prospect added to Client.');
                $location.path('/prospects');
            }).error(function (data, status, headers, config) {
                console.log('Prospect Not added to Client.');
            });
        };

        // Cancel button function
        $scope.go = function (path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })

    //ClientInfoCtrl to view details of a particular client
    .controller('ClientInfoCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

        var prospectFetched = $rootScope.prospectToUpdate;
        $scope.prospect = prospectFetched;

        // back button function
        $scope.go = function (path) {
            javascript:history.go(-1);
        }
    })

    //clientCtrl  to show client list
    .controller('ClientCtrl', function ($scope, $http, $rootScope) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

        //  search keyword by  Prospect name
        $scope.searchWord = function (prospectList) {
            return (angular.lowercase(prospectList.Name).indexOf(angular.lowercase($scope.search) || '') !== -1   );
        };

        // default sorting order is by Prospect start Date
        $scope.orderByField = 'StartDate';

        $scope.showClientInfo = function (prospect) {
            $rootScope.prospectToUpdate = prospect;
        };

        $http.get(baseURL + 'prospect/all/').success(function (data, status, headers, config) {
            $scope.prospects = data;
        }).error(function (data, status, header, config) {
        });
    })

    //  VolunteerCtrl to add Volunteer
    .controller('VolunteerCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('clientList').style.visibility = 'visible';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;
        $scope.volunteerRole =
            [{
                value: 'Domain Advisor',
                name: 'Domain Advisor'
            }, {
                value: 'Technical Advisor',
                name: 'Technical Advisor'
            }, {

                value: 'Probable Team Member',
                name: 'Probable Team Member'
            }]
        ;
        $scope.Role = 'Domain Advisor';
        $scope.changeRole = function () {
            console.log($scope.volunteerRole[2].value);
            if (angular.equals($scope.Role, $scope.volunteerRole[2].value)) {
                $scope.showDate = true;
            } else {
                $scope.showDate = false;
            }
        };

        $scope.addVolunteer = function () {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                UserID: $rootScope.currentUser,
                ParticipationRole: $scope.Role,
                AvailableDate: $scope.CreateDate,
                Notes: $scope.Notes
            };
            $http.post(baseURL + 'participant/', data = data).success(function (data, status, headers, config) {
                console.log('volunteer added.');
                $location.path('/prospects');
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('volunteer not added.');
            });
        };

        // Cancel button function
        $scope.go = function (path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })

    //controller to show discussion on particular prospect
    .controller('ProspectDiscussionCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;
        $scope.Role = 'Domain Advisor';
        $scope.discussion = $rootScope.discussionToView;
        console.log("$scope.discussion", $scope.discussion.Answers);

        $scope.addAnswer = function () {
            var data = {
                DiscussionID: $rootScope.discussionToView.DiscussionID,
                ProspectID: $rootScope.discussionToView.ProspectID,
                UserID: $rootScope.discussionToView.UserID,
                Query: $rootScope.discussionToView.Query,
                Answers: [
                    {
                        AnswerStr: $scope.answer,
                        UserID: $rootScope.salesName
                    }
                ]
            };
            console.log(data);
            $http.put(baseURL + 'discussion/', data = data).success(function (data, status, headers, config) {
                console.log('discussion updated.', data);
                console.log('discussion updated.');
                $location.path('/discussions');
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('discussion not updated.');
            });
        };
    })


    .controller('ScheduleCallCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        var currentProspect = $rootScope.prospectToUpdate;
        console.log("current prospect:", currentProspect);

        $scope.typeOfCall = [
            {
                value: 'Internal Prep call',
                name: 'Internal Prep call'
            },
            {
                value: 'Client engg call',
                name: 'Client engg call'
            }
        ];
        $scope.call = 'Internal Prep call';

        // display volunteer table
        $http.get(baseURL + 'participant/prospectid/' + currentProspect.ProspectID)
            .success(function (data, status, headers, config) {
                $rootScope.participants = data;
                $scope.participants = $rootScope.participants;
                console.log("participants: ", $scope.participants);
            }).error(function (data, status, header, config) {});

        // set call time
        jQuery(function () {
            jQuery('#fromTime').datetimepicker();
            jQuery('#toTime').datetimepicker();

            jQuery("#fromTime").on("dp.change", function (e) {
                jQuery('#toTime').data("DateTimePicker").setMaxDate(e.date);

                $rootScope.ConfDateStart = e.date;
                console.log($rootScope.ConfDateStart);
            });

            jQuery("#toTime").on("dp.change", function (e) {
                //jQuery('#fromTime').data("DateTimePicker").setMaxDate(e.date);

                $rootScope.ConfDateEnd = e.date;
                console.log($rootScope.ConfDateEnd);
            });
        });

        // checkbox handling
        $scope.checkState = function($event, participant) {
            console.log("Participant:", $event);
            console.log("Participant Object:", participant);

            var status;
            if($event == true) {
                console.log("yes", $event);
                status = "Yes";
            } else {
                status = "No";
            }
            var participantData = {
                ProspectID: participant.ProspectID,
                UserID: participant.UserID,
                Included: status,
                ParticipationRole: participant.ParticipationRole,
                AvailableDate: participant.AvailableDate,
                Notes: participant.Notes
            };

            $http.put(baseURL + 'participant/', data = participantData)
                .success(function (data, status, headers, config) {
                    console.log('participant updated.');
                }).error(function (participantData, status, headers, config) {
                    console.log(participantData, status, headers, config);
                    console.log('participant not added.');
                });
        };

        var numberOfVolunteer = 0;
        var attendee_array;
        var attendees;
        var start = '{ "email" : ';
        var end;
        var attendee;
        var qoute = '"';

        $scope.scheduleCall = function () {
            console.log("$scope.call: ", $scope.call);
            var status;

            if(angular.equals($scope.call, "Internal Prep call")) {
                console.log("ConfDateStart: ", $rootScope.ConfDateStart);
                status = "Prep call scheduled for " + (new Date($rootScope.ConfDateStart)).toLocaleString('en-US');
            } else {
                status = "Client call scheduled for " + (new Date($rootScope.ConfDateStart)).toLocaleString('en-US');
            }
            var prospectData = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                Name: currentProspect.Name,
                ConfCalls: [
                    {
                        ConfDateStart: $rootScope.ConfDateStart,
                        ConfDateEnd: $rootScope.ConfDateEnd,
                        ConfType: $scope.call
                    }
                ],
                TechStack: currentProspect.TechStack,
                Domain: currentProspect.Domain,
                DesiredTeamSize: currentProspect.DesiredTeamSize,
                ProspectNotes: currentProspect.ProspectNotes,
                CreateDate: currentProspect.CreateDate,
                SalesID: $rootScope.salesName,
                ProspectStatus: status
            };

            $http.put(baseURL + 'prospect/', data = prospectData)
                .success(function (data, status, headers, config) {
                console.log('Call details added to Prospect.');
                //checkAuth();
                $location.path('/prospects');
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('Error occurred.');
            });

            $http.get(baseURL + 'participant/prospectid/' + currentProspect.ProspectID)
                .success(function (data, status, headers, config) {

                    console.log (data);
                    var participantData = JSON.stringify(data);
                    console.log("participantData: ", participantData);
                    if (JSON.parse(participantData) == null) {
                        numberOfVolunteer = 0;
                    }
                    else {
                        numberOfVolunteer = JSON.parse(participantData).length;
                        var volunteersList = JSON.parse(participantData);
                        console.log("volunteersList: ", volunteersList);

                        for (var i = 0; i < numberOfVolunteer; i++) {
                            if (volunteersList[i].Included == "Yes" && volunteersList[i].UserID != "") {
                                if (i == numberOfVolunteer - 1) {
                                    end = '} ';
                                } else {
                                    end = "}, ";
                                }
                                attendee = volunteersList[i].UserID;
                                console.log("attendee: ", attendee);
                                if (attendees == null) {
																	  attendees = (start + qoute + attendee + qoute + end);
                                    $rootScope.attendees = attendees;
                                    console.log(" null attendees: ", attendees);
                                } else {
                                    attendees += (start + qoute + attendee + qoute + end);
                                    $rootScope.attendees += attendees;
                                    console.log(" not nul attendees: ", attendees);
                                }
                            }
                        }
                        if (attendees) {
                            attendee_array = '[ ' + attendees + ' ]';
                            console.log("attendee_array: ", attendee_array);
                            checkAuth();
                        }
                    }

                }).error(function (data, status, header, config) {
                console.log("Participants not fecthed.")
            });

            //send calender invite
            function sendCalendarInvite() {
                var event = {
                    'summary': 'Prospect: ' + currentProspect.Name + ' ' + $scope.call,
                    'start': {
                        'dateTime': $rootScope.ConfDateStart,
                        'timeZone': 'GMT+5:30'
                    },
                    'end': {
                        'dateTime': $rootScope.ConfDateEnd,
                        'timeZone': 'GMT+5:30'
                    },
                    'attendees': jQuery.parseJSON(attendee_array),
                    'reminders': {
                        'useDefault': false,
                        'overrides': [
                            {'method': 'email', 'minutes': 24 * 60},
                            {'method': 'popup', 'minutes': 10}
                        ]
                    }
                };

                var request = gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event
                });

                request.execute(function (event) {
                    console.log('Event created: ' + event.htmlLink);
                });
            };

            function loadCalendarApi() {
                gapi.client.load('calendar', 'v3', sendCalendarInvite);
            }

            // Check if current user has authorized this application.
            function checkAuth() {
                var api = gapi.auth2.getAuthInstance();
                var user = api.currentUser.get();
                var options = new gapi.auth2.SigninOptionsBuilder(
                    {'scope': 'email https://www.googleapis.com/auth/calendar'});
                user.grant(options).then(
                    function(success){
                        console.log(JSON.stringify({message: "success", value: success}));
                        loadCalendarApi();
                    },
                    function (fail) {
                        alert(JSON.stringify({message: "fail", value: fail}));
                    });
            };
        };

        // Cancel button function
        $scope.go = function (path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })

    // controller for view Prospect
    .controller('ViewProspectCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;

        /*$scope.editProspect = function() {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                Name: $scope.prospect.Name,
                CreateDate : $scope.prospect.CreateDate,
                TechStack: $scope.prospect.TechStack,
                Domain: $scope.prospect.Domain,
                DesiredTeamSize: $scope.prospect.DesiredTeamSize,
                ProspectNotes: $scope.prospect.ProspectNotes,
                ConfCalls: $rootScope.prospectToUpdate.ConfCalls,
                ProspectStatus: $rootScope.prospectToUpdate.ProspectStatus
            };
            console.log(data);

            $http.put(baseURL + 'prospect/', data = data).success(function(data, status, headers, config) {
                console.log('Prospect updated.');
                $location.path('/prospects');
            }).error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                    console.log('Prospect not updated.');
                });
        };*/

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })



    //controller for reports
    .controller('ReportsCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

        var prospect_report = $rootScope.prospectToUpdate;
        $scope.prospect = prospect_report;

        $http.get(baseURL + 'prospect/all/').success(function (data, status, headers, config) {
            $scope.TechStack = data;
            var testArray = [];
            var a = [], split_array = [], trimmed_array = [];
            for (var i = 0; i < data.length; i++) {
                testArray[i] = data[i].TechStack;
            }
            for (var j = 0; j < testArray.length; j++) {
                a[j] = testArray[j];
                if (a[j].indexOf(',') !== -1) {
                    split_array = a[j].split(',');
                    for (var k = 0; k < split_array.length; k++) {
                        testArray.push(split_array[k]);
                    }
                }
            }
            for (var l = 0; l < testArray.length; l++) {
                trimmed_array[l] = testArray[l];
                if (trimmed_array[l].indexOf(',') !== -1) {
                    var index = testArray.indexOf(trimmed_array[l]);
                    testArray.splice(index, 1)
                }
            }
            for (var m = 0; m < testArray.length; m++) {
                testArray[m] = angular.uppercase(testArray[m]);
            }
            console.log(testArray);

            var newArray = countArray(testArray);

            function countArray(original) {
                var compressed = [];
                // make a copy of the input array
                var copy = original.slice(0);
                // first loop goes over every element
                for (var i = 0; i < original.length; i++) {
                    var myCount = 0;
                    // loop over every element in the copy and see if it's the same
                    for (var w = 0; w < copy.length; w++) {
                        if (original[i] == copy[w]) {
                            // increase amount of times duplicate is found
                            myCount++;
                            // sets item to undefined
                            delete copy[w];
                        }
                    }
                    if (myCount > 0) {
                        var a = {};
                        a.value = original[i];
                        a.count = myCount;
                        compressed.push(a);
                    }
                }
                return compressed;
            }

            $(document).ready(function () {

                var parentArray = $.map(newArray[0], function (value, index) {
                    return [value];
                });
                for (var i = 0; i < newArray.length; i++) {
                    var array = $.map(newArray[i], function (value, index) {
                        return [value];
                    });
                    parentArray[i] = array;
                }
                var Array = $.map(parentArray, function (value, index) {
                    return [value];
                });
                RenderPieChart('report-container', [
                    Array
                ]);
                function RenderPieChart(elementId, dataList) {
                    var colors = ["#2a8482", "#64DECF", "#BCCDF8", '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
                        '#FF9655', '#FF0081', '#6AF9C4'];
                    for (var i = 0; i < dataList.length; i++) {
                        new Highcharts.Chart({
                            chart: {
                                renderTo: elementId,
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false
                            }, title: {
                                text: 'Pie Chart for TechStack'
                            },
                            tooltip: {
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                                }
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    colors: colors,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        distance: -30,
                                        color: '#000000',
                                        connectorColor: '#000000',
                                        formatter: function () {
                                            return '<b>' + this.point.name;
                                        }
                                    }
                                }
                            },
                            series: [{
                                type: 'pie',
                                name: 'Browser share',
                                data: dataList[0]
                            }]
                        });
                    }
                }
            });

        }).error(function (data, status, header, config) {});
    });




