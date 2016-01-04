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

                    // The ID token you need to pass to your backend:
                    $rootScope.id_token = data.getAuthResponse().id_token;
                    console.log("ID Token: " + $rootScope.id_token);

                    var profile = data.getBasicProfile();
                    $rootScope.currentUser = profile.getEmail();
                    $rootScope.currentUserImage = profile.getImageUrl();
                    $rootScope.salesName = profile.getName();

                    $rootScope.firstName = $rootScope.salesName.substring(0, $rootScope.salesName.indexOf(' '));
                    console.log("firstname",$rootScope.firstName);

                    $rootScope.userId = $rootScope.currentUser;

                    $rootScope.assignRole = "";

                    function addUser() {
                        $rootScope.assignRole = "Engineer";
                        var data = {
                            Email: $rootScope.currentUser,
                            Role: $rootScope.assignRole
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
                            allUsers = JSON.parse(allUsers);
                            var totalUsers = allUsers.length;

                            $rootScope.userExists = 0;
                            for (var i = 0; i < totalUsers; i++) {
                                console.log(allUsers[i].Email);
                                console.log("$rootScope.currentUser", $rootScope.currentUser);
                                if (angular.equals($rootScope.currentUser, allUsers[i].Email)) {
                                    console.log("Already exists.");
                                    $rootScope.userExists = 1;
                                    $rootScope.assignRole = allUsers[i].Role;
                                    break;
                                }
                            }
                             if ($rootScope.userExists == 0) {
                                 addUser();
                             }
                        } else {
                            addUser();
                        }

                        if (angular.equals("Engineer", $rootScope.assignRole)) {
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
        $(document).ready(function(){
            $('ul.nav li.dropdown').hover(function() {
                $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(200);
            }, function() {
                $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
            });
        });
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

                    //document.getElementById('sign-out').style.visibility = 'hidden';
                    //document.getElementById('prospectList').style.visibility = 'hidden';
                    //document.getElementById('clientList').style.visibility='hidden';
                    //document.getElementById('reports').style.visibility='hidden';
                    //document.getElementById('headerText').style.visibility='visible';
                    //document.getElementById('titleText').style.display='none';
                    //document.getElementById('signin').style.visibility = 'visible';
                    //document.getElementById('g-signinP').style.removeProperty('height');
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
                    $http.get(baseURL + 'participant/prospectid/' + prospectList[i].ProspectID)
                        .success(function(participantData, status, headers, config){
                            var participantData = JSON.stringify(participantData);
                            if (JSON.parse(participantData) == null) {
                                prospectList[index].noOfVolunteers = 0;
                            }
                            else {
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
            var date = new Date(creationDate);
            var n = date.toDateString();
            var time = date.toLocaleTimeString();
            var status = "Prospect created on " + n + ' ' + time;
                // creationDate.toLocaleString('en-US');
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
        $rootScope.prospect = prospect;
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
                Notes: $scope.Notes,
                Included: "Yes"
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
        $scope.answers = $rootScope.discussionToView.Answers;

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
            $http.post(baseURL + 'discussion/answer', data = data).success(function (data, status, headers, config) {
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
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

       // code to show full notes on mouse hover
        $('.dropdown').hover( function () {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(200);
        }, function() {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
        });

        /* reffer for fix footer height
             $().ready(function(){
            ch = $('#participantTable').width();
            alert(ch);
            $('#scheduleCallContainer').css({
                width : ch +'px'
            })
            });*/
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
                //$rootScope.participants = data;

                var displayParticipants = JSON.stringify(data);
                console.log("displayParticipants", displayParticipants);

                if (JSON.parse(displayParticipants) != null) {
                    var volunteersList = JSON.parse(displayParticipants);
                    numberOfVolunteer = volunteersList.length;

                    console.log("volunteersList: ", volunteersList);

                    for (var i = 0; i < numberOfVolunteer; i++) {
                        var volunteerName = volunteersList[i].UserID.substring(0, volunteersList[i].UserID.indexOf('@'));
                        var volunteerFirstName = volunteerName.split('.')[0];
                        var volunteerLastName = volunteerName.split('.')[1];
                        volunteersList[i].UserID = volunteerFirstName.charAt(0).toUpperCase() +
                            volunteerFirstName.substr(1) + ' ' + volunteerLastName.charAt(0).toUpperCase() +
                            volunteerLastName.substr(1);
                        var notesLength = volunteersList[i].Notes.length;
                        if(notesLength > 50){
                            volunteersList[i].flag = 1;
                        }
                        else{
                            volunteersList[i].flag = 0;
                        }
                    }
                } else {
                    console.log("Empty Volunteer List.");
                }
                console.log("volunteersList after flag: ", volunteersList);
                $scope.participants = volunteersList;
                console.log("participants: ", $scope.participants);
            }).error(function (data, status, header, config) {
        });

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
        $scope.checkState = function ($event, participant) {
            console.log("Participant:", $event);
            console.log("Participant Object:", participant);

            var pStatus;
            if ($event == true) {
                console.log("yes", $event);
                pStatus = "Yes";
            } else if ($event == false) {
                pStatus = "No";
            }
            var participantData = {
                ProspectID: participant.ProspectID,
                UserID: participant.UserID,
                Included: pStatus,
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

        function updateParticipant(callAttendees) {
            if (callAttendees != undefined) {

            } else {
                console.log("Call attendees not updated... Coz all are included.");
            }
        };

        // set Default call participation status of all volunteers to "Yes"
        $http.get(baseURL + 'participant/prospectid/' + currentProspect.ProspectID)
            .success(function (data, status, headers, config) {
                console.log (data);
                if (data != undefined) {
                    var callParticipants = JSON.stringify(data);
                    console.log("callParticipants", callParticipants);

                    if (JSON.parse(callParticipants) != null) {
                        var volunteersList = JSON.parse(callParticipants);
                        numberOfVolunteer = volunteersList.length;

                        console.log("volunteersList: ", volunteersList);

                        for (var i = 0; i < numberOfVolunteer; i++) {
                            volunteersList[i].Included = "Yes";
                            (function (index) {
                                $http.put(baseURL + 'participant/', data = volunteersList[i])
                                    .success(function (data, status, headers, config) {
                                        console.log('participant updated.');
                                    }).error(function (participantData, status, headers, config) {
                                    console.log(participantData, status, headers, config);
                                    console.log('participant not added.');
                                });
                            }(i));
                        }
                    } else {
                        console.log("Empty Volunteer List.");
                    }
                }
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
            });


        var numberOfVolunteer = 0;
        var attendee_array;
        var attendees;
        var start = '{ "email" : ';
        var end;
        var attendee;
        var qoute = '"';

        $scope.scheduleCall = function () {
            console.log("$scope.call: ", $scope.call);
            var prospectStatus;

            var date = new Date($rootScope.ConfDateStart);
            var n = date.toDateString();
            var time = date.toLocaleTimeString();

            if(angular.equals($scope.call, "Internal Prep call")) {
                console.log("ConfDateStart: ", $rootScope.ConfDateStart);
                prospectStatus = "Prep call scheduled for " + n + ' ' + time;
                    // (new Date($rootScope.ConfDateStart)).toLocaleString('en-US');
            } else {
                prospectStatus = "Client call scheduled for " + n + ' ' + time;
                    // (new Date($rootScope.ConfDateStart)).toLocaleString('en-US');
            }
            console.log("Prospect Status: ", prospectStatus);

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
                ProspectStatus: prospectStatus
            };

            // update prospect after scheduling call
            $http.put(baseURL + 'prospect/', data = prospectData)
                .success(function (data, status, headers, config) {
                    console.log('Call details added to Prospect.');
                    $location.path('/prospects');
                }).error(function (data, status, headers, config) {
                    console.log(data, status, headers, config);
                    console.log('Error occurred.');
                });

            // select participants before sending calender invite
            $http.get(baseURL + 'participant/prospectid/' + currentProspect.ProspectID)
                .success(function (data, status, headers, config) {

                    console.log (data);
                    var participants = JSON.stringify(data);
                    console.log("participants: ", participants);
                    if (JSON.parse(participants) == null) {
                        numberOfVolunteer = 0;
                    }
                    else {
                        numberOfVolunteer = JSON.parse(participants).length;
                        var volunteersList = JSON.parse(participants);
                        console.log("volunteersList: ", volunteersList);

                        for (var i = 0; i < numberOfVolunteer; i++) {
                            if (volunteersList[i].Included == "Yes" && volunteersList[i].UserID != "") {
                                end = ' }';
                                attendee = volunteersList[i].UserID;
                                console.log("attendee: ", attendee);
                                if (attendees == null) {
                                    attendees = (start + qoute + attendee + qoute + end);
                                    $rootScope.attendees = attendees;
                                    console.log(" null attendees: ", attendees);
                                } else {
                                    attendees += (', ' + start + qoute + attendee + qoute + end);
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

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })

    //controller for reports
    .controller('ReportsListCtrl',function($scope, $http, $rootScope, $location){
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.prospect = $rootScope.prospectToUpdate;
        $http.get(baseURL + 'prospect/all/').success(function (data, status, headers, config) {
            $scope.prospect = data;

            $rootScope.flag = 1;
            var testArray = [],a = [], i,split_array = [], trimmed_array = [], j, k, l, m,index;
            var countJan = 0, countFeb = 0, countMar = 0, countApr = 0, countMay = 0, countJun = 0,
                countJul = 0, countAug = 0, countSept = 0, countOct = 0, countNov = 0, countDec = 0;
            for ( i = 0; i < data.length; i++ ) {

                testArray[i] = data[i].CreateDate;
                a[i] = testArray[i].split('-');
                testArray[i] = a[i][1];

                if(testArray[i] === '01'){
                    countJan++;
                }else if(testArray[i] === '02')
                {
                    countFeb++;
                }else if(testArray[i] === '03')
                {
                    countMar++;
                }else if(testArray[i] === '04')
                {
                    countApr++;
                }else if(testArray[i] === '05')
                {
                    countMay++;
                }else if(testArray[i] === '06')
                {
                    countJun++;
                }else if(testArray[i] === '07')
                {
                    countJul++;
                }else if(testArray[i] === '08')
                {
                    countAug++;
                }else if(testArray[i] === '09')
                {
                    countSept++;
                }else if(testArray[i] === '10')
                {
                    countOct++;
                }else if(testArray[i] === '11')
                {
                    countNov++;
                }else if(testArray[i] === '12')
                {
                    countDec++;
                }
            }

            $(document).ready(function () {

                RenderLineChart('report-container', [
                    [countJan],[countFeb],[countMar],[countApr],[countMay],[countJun],[countJul],[countAug],
                    [countSept],[countOct],[countNov],[countDec]
                ]);
            });

            $scope.reportTypes =
                [{
                    value: 'Prospect addition per month',
                    name: 'Prospect addition per month'

                }, {
                    value: 'Demand for various technologies',
                    name: 'Demand for various technologies'
                }, {
                    value: 'Prospects aggregation by domain',
                    name: 'Prospects aggregation by domain'
                }, {
                    value: 'Probable teamsize',
                    name: 'Probable teamsize'
                }, {
                    value: 'No. of prospects by each Sales Person',
                    name: 'No. of prospects by each Sales Person'
                },{
                    value: 'Ratio of prospect vs client',
                    name: 'Ratio of prospect vs client'
                }]
            ;
            $scope.reportType = 'Prospect addition per month';
            $scope.changeReport = function () {

                $rootScope.flag = 1;
                var testArray = [],a = [], i,split_array = [], trimmed_array = [], j, k, l, m,index,prospectCount = 0, clientsCount = 0,countAfterTen=0;
                var countJan = 0, countFeb = 0, countMar = 0, countApr = 0, countMay = 0, countJun = 0,
                    countJul = 0, countAug = 0, countSept = 0, countOct = 0, countNov = 0, countDec = 0;

                if (angular.equals($scope.reportType, $scope.reportTypes[0].value)) {

                    for ( i = 0; i < data.length; i++ ) {

                        testArray[i] = data[i].CreateDate;
                        a[i] = testArray[i].split('-');
                        testArray[i] = a[i][1];

                        if(testArray[i] === '01'){
                            countJan++;
                        }else if(testArray[i] === '02')
                        {
                            countFeb++;
                        }else if(testArray[i] === '03')
                        {
                            countMar++;
                        }else if(testArray[i] === '04')
                        {
                            countApr++;
                        }else if(testArray[i] === '05')
                        {
                            countMay++;
                        }else if(testArray[i] === '06')
                        {
                            countJun++;
                        }else if(testArray[i] === '07')
                        {
                            countJul++;
                        }else if(testArray[i] === '08')
                        {
                            countAug++;
                        }else if(testArray[i] === '09')
                        {
                            countSept++;
                        }else if(testArray[i] === '10')
                        {
                            countOct++;
                        }else if(testArray[i] === '11')
                        {
                            countNov++;
                        }else if(testArray[i] === '12')
                        {
                            countDec++;
                        }
                    }
                    $(document).ready(function () {

                        RenderLineChart('report-container', [
                            [countJan],[countFeb],[countMar],[countApr],[countMay],[countJun],[countJul],[countAug],
                            [countSept],[countOct],[countNov],[countDec]
                        ]);
                    });
                }

                else if (angular.equals($scope.reportType, $scope.reportTypes[1].value)){

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].TechStack;
                    }
                    for ( j = 0; j < testArray.length; j++ ) {
                        a[j] = testArray[j];
                        if (a[j].indexOf(',') !== -1) {
                            split_array = a[j].split(',');
                            for ( k = 0; k < split_array.length; k++) {
                                testArray.push(split_array[k]);
                            }
                        }
                    }
                    for ( l = 0; l < testArray.length; l++) {
                        if (testArray[l].indexOf(',') == -1) {
                            trimmed_array.push(testArray[l]);
                        }
                    }
                    testArray = trimmed_array;

                    for ( m = 0; m < testArray.length; m++ ) {

                        testArray[m] = angular.uppercase(testArray[m]);
                        testArray[m] = testArray[m].replace(/^[\s,]+|[\s,]+$/g, '');
                    }

                    var newArray = countArrayTechstack(testArray);

                    $(document).ready(function () {

                        var parentArray = $.map(newArray[0], function (value) {
                            return [value];
                        });
                       console.log(parentArray);
                        for ( i = 0; i < newArray.length; i++ ) {
                            var array = $.map(newArray[i], function (value) {
                                return [value];
                            });
                            parentArray[i] = array;
                        }
                        if(newArray.length == 1 && parentArray.length == 2){

                            parentArray.length = 1;
                        }
                        var Array = $.map(parentArray, function (value) {
                            return [value];
                        });
                            RenderPieChartTechstack('report-container', [
                              Array
                            ]);
                    });
                }

                else if (angular.equals($scope.reportType, $scope.reportTypes[2].value)){

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].Domain;
                    }
                    for ( j = 0; j < testArray.length; j++ ) {
                        a[j] = testArray[j];
                        if (a[j].indexOf(',') !== -1) {
                            split_array = a[j].split(',');
                            for ( k = 0; k < split_array.length; k++ ) {
                                testArray.push(split_array[k]);
                            }
                        }
                    }
                    for ( l = 0; l < testArray.length; l++ ) {
                        trimmed_array[l] = testArray[l];
                        if (trimmed_array[l].indexOf(',') !== -1) {
                            index = testArray.indexOf(trimmed_array[l]);
                            testArray.splice(index, 1)
                        }
                    }
                    for ( m = 0; m < testArray.length; m++ ) {
                        testArray[m] = angular.uppercase(testArray[m]);
                        testArray[m] = testArray[m].replace(/^[\s,]+|[\s,]+$/g, '');
                    }

                    var newArray = countArrayDomain(testArray);

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
                        if(newArray.length == 1 && parentArray.length == 2){

                            parentArray.length = 1;
                        }
                        var Array = $.map(parentArray, function (value, index) {
                            return [value];
                        });

                        RenderPieChartDomain('report-container', [
                            Array,['OTHER',countAfterTen]

                        ]);
                    });
                }

                else if (angular.equals($scope.reportType, $scope.reportTypes[3].value)){

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].DesiredTeamSize.toString();
                    }

                    var newArray = countArrayTeamSize(testArray);

                    $(document).ready(function () {
                        var parentArray = $.map(newArray[0], function (value, index) {
                            return [value];
                        });
                        for ( i = 0; i < newArray.length; i++ ) {
                            var array = $.map(newArray[i], function (value, index) {
                                return [value];
                            });
                            parentArray[i] = array;
                        }
                        if(newArray.length == 1 && parentArray.length == 2){

                            parentArray.length = 1;
                        }
                        var Array = $.map(parentArray, function (value, index) {
                            return [value];
                        });
                        RenderPieChartTeamSize('report-container', [
                            Array
                        ]);
                    });
                }

                else if (angular.equals($scope.reportType, $scope.reportTypes[4].value)){

                    for( i = 0; i < data.length; i++ ){
                        testArray[i] = data[i].SalesID;
                    }
                    for ( j = 0; j < testArray.length; j++ ) {

                        testArray[j] = angular.uppercase(testArray[j]);
                    }
                    var newArray = countArraySalesPerson(testArray);

                    $(document).ready(function () {

                        var parentArray = $.map(newArray[0], function (value, index) {
                            return [value];
                        });
                        for ( i = 0; i < newArray.length; i++ ) {
                            var array = $.map(newArray[i], function (value, index) {
                                return [value];
                            });
                            parentArray[i] = array;
                        }
                        console.log(parentArray);
                        console.log(parentArray[0]);
                        console.log(newArray.length);
                        if(newArray.length == 1 && parentArray.length == 2){

                            parentArray.length = 1;
                        }
                        console.log(parentArray.length);
                        var Array = $.map(parentArray, function (value, index) {
                            return [value];
                        });

                        RenderBarChartSalesPerson('report-container', [
                            Array
                        ]);
                    });
                }

                else if( angular.equals($scope.reportType, $scope.reportTypes[5].value) ) {

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].BUHead;

                        if (testArray[i].length === 0 ) {
                            prospectCount++;
                        }
                        else {
                            clientsCount++;
                        }
                    }
                    $(document).ready(function () {

                        RenderPieChartPropsectvsClient('report-container', [
                            ['Propsects',prospectCount],
                            ['Clients',clientsCount]
                        ]);
                    });
                }
            };

        }).error(function (data, status, header, config) {});
        function RenderLineChart(elementId,dataList) {
            new Highcharts.Chart({
                title: {
                    text: 'Prospect addition per month',
                    x: -20 //center
                },
                chart: {
                    renderTo: elementId,
                    height:600,
                    width:1140
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'No. of Prospects Added'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {},

                series: [{
                    name:'No. of Prospects',
                    data: dataList
                }]
            })
        }
        function RenderPieChartTechstack(elementId, dataList) {

            for ( i = 0; i < dataList.length; i++) {
                new Highcharts.Chart({

                    chart: {
                        renderTo: elementId,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:600,
                        width:1140
                    }, title: {
                        text: 'Demand for various technologies'
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.point.name + '</b>: ' + this.point.y;
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            size:400,
                            center:[550,200],
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + '%';
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
        function RenderPieChartDomain(elementId, dataList) {

            for (var i = 0; i < dataList.length; i++ ) {
                new Highcharts.Chart({

                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        },
                        renderTo: elementId,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:600,
                        width:1140
                    }, title: {
                        text: 'Prospects aggregation by domain',
                        name: 'Prospects aggregation by domain'
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.point.name + '</b>: ' + this.point.y;
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            size:'100%',
                            center:[550,200],
                            cursor: 'pointer',
                            depth:55,
                            dataLabels:{
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: '+ Highcharts.numberFormat(this.percentage, 2) + '%';
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
        function RenderPieChartTeamSize(elementId, dataList) {

            for (var i = 0; i < dataList.length; i++ ) {
                new Highcharts.Chart({

                    chart: {
                        type: 'pie',

                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        },

                        renderTo: elementId,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:600,
                        width:1140
                    }, title: {
                        text: 'Probable teamsize'
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.point.name + '</b>: ' + this.point.y;
                        }
                    },
                    plotOptions: {
                        pie: {

                            allowPointSelect: true,
                            innerSize: 170,
                            size:400,
                            center:[550,200],
                            cursor: 'pointer',
                            depth:55,
                            dataLabels:{

                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: '+ Highcharts.numberFormat(this.percentage, 2) + '%';
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
        function RenderBarChartSalesPerson(elementId, dataList) {

            for (var i = 0; i < dataList.length; i++ ) {
                new Highcharts.Chart({

                    chart: {
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        },
                        type: 'column',
                        renderTo: elementId,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:600,
                        width:1140
                    }, title: {
                        text:'No. of prospects by each Sales Person'
                    },
                    xAxis: {
                        categories: [

                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text:' <b>No. of Propsects added by Sales Person</b>'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0,
                            depth:25
                        }
                    },
                    series: [{

                        name: 'Sales Person Performance',
                        data: dataList[0]
                    }]
                });
            }
        }
        function RenderPieChartPropsectvsClient(elementId, dataList) {

            new Highcharts.Chart({

                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    },
                    renderTo: elementId,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height:600,
                    width:1140
                }, title: {
                    text: 'Ratio of prospect vs client'
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.point.name + '</b>: ' + this.point.y ;
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        size:400,
                        center:[550,200],
                        cursor: 'pointer',
                        depth:55,
                        dataLabels:{
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>: '+ Highcharts.numberFormat(this.percentage, 2) + '%';
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: dataList
                }]
            });
        }
        function countArrayDomain(original) {
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
        function countArrayTechstack(original) {
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
        function countArrayTeamSize(original) {
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
        function countArraySalesPerson(original) {
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


    })

       // controller for client discussion
    .controller('viewClientDiscussionCtrl', function($scope, $http, $rootScope, $location){
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

        console.log("in viewClientDiscussionCtrl ", $rootScope.prospectToUpdate);

        $rootScope.client = $rootScope.prospectToUpdate;
        console.log("in prospect")

        $http.get(baseURL + 'discussion/prospectid/'+ $rootScope.client.ProspectID).success(function(data, status, headers, config) {
            console.log("discussion/prospectid/", data);
            $scope.discussions = data;
        }).error(function (data, status, header, config) {});

        $scope.showDiscussion = function (discussion) {
            console.log("showdiscussion: ", discussion);
            $rootScope.discussionToView = discussion;
            console.log("$rootScope.discussionToView: ", $rootScope.discussionToView);
        };
    })

    .controller('clientDiscussionCtrl', function($scope, $http, $rootScope, $location){
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        $rootScope.client = $rootScope.prospectToUpdate;
        $scope.discussion = $rootScope.discussionToView;
        console.log("$scope.discussion", $scope.discussion.Answers);
        $scope.answers = $rootScope.discussionToView.Answers;

    })

    .controller('ReportTeamsizeCtrl' , function($scope, $http, $rootScope, $location){
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('titleText').style.display = 'none';

        $(function () {
            $scope.prospect = $rootScope.prospectToUpdate;
            $http.get(baseURL + 'prospect/all/').success(function (data, status, headers, config) {
                $scope.prospect = data;
                var testArray = [];
                for (var i = 0; i < data.length; i++) {
                    testArray[i] = data[i].StartDate;
                }
                console.log(testArray);
                var detailChart;
                $(document).ready(function () {
                    // create the detail chart
                    console.log(testArray);
                    function createDetail(masterChart) {
                        // prepare the detail chart
                        var detailData = [],
                            detailStart = testArray[0][0];
                        console.log(detailStart);
                        $.each(masterChart.series[0].data, function () {
                            if (this.x >= detailStart) {
                                detailData.push(this.y);
                            }
                        });
                        console.log(detailData);
                        // create a detail chart referenced by a global variable
                        detailChart = $('#detail-container').highcharts({
                            chart: {
                                marginBottom: 120,
                                reflow: false,
                                marginLeft: 50,
                                marginRight: 20,
                                style: {
                                    position: 'absolute'
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                type: 'datetime'
                            },
                            yAxis: {
                                title: {
                                    text: null
                                },
                                maxZoom: 0.1
                            },
                            tooltip: {
                                formatter: function () {
                                    var point = this.points[0];
                                    return '<b>' + point.series.name + '</b><br/>' + Highcharts.dateFormat('%A %B %e %Y', this.x) + ':<br/>' +
                                        '1 USD = ' + Highcharts.numberFormat(point.y, 2) + ' EUR';
                                },
                                shared: true
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    marker: {
                                        enabled: false,
                                        states: {
                                            hover: {
                                                enabled: true,
                                                radius: 3
                                            }
                                        }
                                    }
                                }
                            },
                            series: [{
                                name: 'USD to EUR',
                                pointStart: detailStart,
                                pointInterval: 24 * 3600 * 1000,
                                data: detailData
                            }],
                            exporting: {
                                enabled: false
                            }
                        }).highcharts(); // return chart
                    }

                    // create the master chart
                    function createMaster() {
                        $('#master-container').highcharts({
                                chart: {
                                    reflow: false,
                                    borderWidth: 0,
                                    backgroundColor: null,
                                    marginLeft: 50,
                                    marginRight: 20,
                                    zoomType: 'x',
                                    events: {
                                        // listen to the selection event on the master chart to update the
                                        // extremes of the detail chart
                                        selection: function (event) {
                                            var extremesObject = event.xAxis[0],
                                                min = extremesObject.min,
                                                max = extremesObject.max,
                                                detailData = [],
                                                xAxis = this.xAxis[0];
                                            // reverse engineer the last part of the data
                                            $.each(this.series[0].data, function () {
                                                if (this.x > min && this.x < max) {
                                                    detailData.push([this.x, this.y]);
                                                }
                                            });
                                            // move the plot bands to reflect the new detail span
                                            xAxis.removePlotBand('mask-before');
                                            xAxis.addPlotBand({
                                                id: 'mask-before',
                                                from: data[0][0],
                                                to: min,
                                                color: 'rgba(0, 0, 0, 0.2)'
                                            });
                                            xAxis.removePlotBand('mask-after');
                                            xAxis.addPlotBand({
                                                id: 'mask-after',
                                                from: max,
                                                to: data[data.length - 1][0],
                                                color: 'rgba(0, 0, 0, 0.2)'
                                            });
                                            detailChart.series[0].setData(detailData);
                                            return false;
                                        }
                                    }
                                },
                                title: {
                                    text: null
                                },
                                xAxis: {
                                    type: 'datetime',
                                    showLastTickLabel: true,
                                    maxZoom: 14 * 24 * 3600000, // fourteen days
                                    plotBands: [{
                                        id: 'mask-before',
                                        from: data[0][0],
                                        to: data[data.length - 1][0],
                                        color: 'rgba(0, 0, 0, 0.2)'
                                    }],
                                    title: {
                                        text: null
                                    }
                                },
                                yAxis: {
                                    gridLineWidth: 0,
                                    labels: {
                                        enabled: false
                                    },
                                    title: {
                                        text: null
                                    },
                                    min: 0.6,
                                    showFirstLabel: false
                                },
                                tooltip: {
                                    formatter: function () {
                                        return false;
                                    }
                                },
                                legend: {
                                    enabled: false
                                },
                                credits: {
                                    enabled: false
                                },
                                plotOptions: {
                                    series: {
                                        fillColor: {
                                            linearGradient: [0, 0, 0, 70],
                                            stops: [
                                                [0, Highcharts.getOptions().colors[0]],
                                                [1, 'rgba(255,255,255,0)']
                                            ]
                                        },
                                        lineWidth: 1,
                                        marker: {
                                            enabled: false
                                        },
                                        shadow: false,
                                        states: {
                                            hover: {
                                                lineWidth: 1
                                            }
                                        },
                                        enableMouseTracking: false
                                    }
                                },
                                series: [{
                                    type: 'area',
                                    name: 'USD to EUR',
                                    pointInterval: 24 * 3600 * 1000,
                                    pointStart: data[0][0],
                                    data: data
                                }],
                                exporting: {
                                    enabled: false
                                }
                            }, function (masterChart) {
                                createDetail(masterChart);
                            })
                            .highcharts(); // return chart instance
                    }

                    // make the container smaller and add a second container for the master chart
                    var $container = $('#pie-teamsize-container')
                        .css('position', 'relative');
                    $('<div id="detail-container">')
                        .appendTo($container);
                    $('<div id="master-container">')
                        .css({
                            position: 'absolute',
                            top: 300,
                            height: 100,
                            width: '100%'
                        })
                        .appendTo($container);
                    // create master and in its callback, create the detail chart
                    createMaster();
                });
            }).error(function (data, status, header, config) {});
        });
    })
;


