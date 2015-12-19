// var baseURL = "http://172.24.212.123:8280/";
var baseURL = "http://presaleshuddle:8080/";

angular.module('PreSales-Huddle')

    .controller('GoogleSignInCtrl', function($scope, $rootScope, $location) {
        function googleLogin(){
            var auth2 = gapi.auth2.getAuthInstance();
            return auth2.signIn();
        }

        $scope.onSignIn = function() {
            googleLogin()
                .then(function (data) {
                    user="";

                    // The ID token you need to pass to your backend:
                    $rootScope.id_token = data.getAuthResponse().id_token;
                    console.log("ID Token: " + $rootScope.id_token);

                    var profile = data.getBasicProfile();

                   /* var options = new gapi.auth2.SigninOptionsBuilder(
                        {'scope': 'email https://www.googleapis.com/auth/drive'});

                    //googleUser = gapi.auth2.currentUser.get();
                    data.grant(options).then(
                        function(success){
                            console.log(JSON.stringify({message: "success", value: success}));
                        },
                        function(fail){
                            alert(JSON.stringify({message: "fail", value: fail}));
                        });*/
                    $rootScope.currentUser = profile.getEmail();
                    $rootScope.currentUserImage = profile.getImageUrl();
                    $rootScope.salesName = profile.getName();

                    $rootScope.salesPerson=['shaila.pawar@synerzip.com'];

                    if(angular.equals(profile.getEmail(),$rootScope.salesPerson[0])){
                        user=1;
                        console.log(user);
                    }    else{
                        user=0;
                        console.log(user);
                    }

                    window.location = '#/prospects';
                    document.getElementById('signin').style.visibility='hidden';
                    document.getElementById('g-signinP').style.height = '0px';
                    document.getElementById('sign-out').style.visibility='visible';
                    document.getElementById('prospectList').style.visibility='visible';
                    document.getElementById('clientList').style.visibility='visible';
		            document.getElementById('headerText').style.visibility='visible';
                    document.getElementById('titleText').style.display='none';
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
            $rootScope.prospectToUpdate = prospect;

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
            $scope.prospects = data;

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
                        alert(" Hi , you are volunteering this prospect.")
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
            var data = {
                Name: $scope.prospectName,
                CreateDate : creationDate,
                TechStack: $scope.techStack,
                Domain: $scope.domain,
                DesiredTeamSize: $scope.teamSize,
                Notes: $scope.notes
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
            $scope.notes = "";
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
                Notes: $scope.prospect.Notes
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

    .controller('AddDiscussionCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
	    document.getElementById('headerText').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        var prospect = $rootScope.prospectToUpdate;
        $scope.prospect=prospect;

        console.log($rootScope.currentUser);

        $scope.addDiscussion = function() {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                UserID: $rootScope.currentUser,
                Query: $scope.query
            };

            $http.post(baseURL + 'discussion/', data = data).success(function(data, status, headers, config) {
                console.log('Discussion added.');
                $location.path('/discussions');
            }).error(function(data, status, headers, config) {
                console.log('Discussion not added.');
            });

            $scope.query = "";
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })

    .controller('DiscussionsCtrl', function($scope, $http, $rootScope) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        var prospect = $rootScope.prospectToUpdate;
        $scope.prospect=prospect;

        $http.get(baseURL + 'discussion/prospectid/' + prospect.ProspectID).success(function(data, status, headers, config) {
            console.log(data);
            $scope.discussions = data;
        }).error(function(data, status, header, config) {});

        //$scope.giveAnswer = function() {
        //    document.getElementById('ansModal').dialog('open');
        //}
        //
        //$scope.addAnswer = function() {
        //    var data = {
        //        ProspectID: $rootScope.prospectToUpdate.ProspectID,
        //        UserID: $rootScope.currentUser,
        //        Query: $scope.query,
        //        Answer: $scope.answer
        //    };
        //
        //    $http.post(baseURL + 'discussion/', data = data).success(function(data, status, headers, config) {
        //        console.log('Discussion added.');
        //        $location.path('/discussions');
        //    }).error(function(data, status, headers, config) {
        //        console.log('Discussion not added.');
        //    });
        //}
    })

    //addTOClientCtrl to add prospect to client
    .controller('AddClientCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        $scope.maxDate = new Date();
        $scope.StartDate = $scope.maxDate;

        var prospectFetched = $rootScope.prospectToUpdate;
        $scope.prospect = prospectFetched;

        $scope.addToClient = function() {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                Name: $scope.prospect.Name,
                CreateDate: $scope.CreateDate,
                StartDate : $scope.StartDate,
                TechStack: $scope.prospect.TechStack,
                Domain: $scope.prospect.Domain,
                DesiredTeamSize: $scope.prospect.DesiredTeamSize,
                Notes: $scope.prospect.Notes ,
                BUHead:$scope.Head,
                TeamSize:$scope.TeamSize,
                SalesID: $rootScope.salesName
            };

            $http.put(baseURL + 'prospect/', data = data).success(function(data, status, headers, config) {
                console.log('Prospect added to Client.');
                $location.path('/prospects');
            }).error(function(data, status, headers, config) {
                    console.log('Prospect Not added to Client.');
            });
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })

    //ClientInfoCtrl to view details of a particular client
    .controller('ClientInfoCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        var prospectFetched = $rootScope.prospectToUpdate;
        $scope.prospect = prospectFetched;

        // back button function
        $scope.go = function(path) {
            javascript:history.go(-1);
        }
    })

    //clientCtrl  to show client list
    .controller('ClientCtrl', function($scope, $http, $rootScope) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        //  search keyword by  Prospect name
        $scope.searchWord = function (prospectList) {
            return (angular.lowercase(prospectList.Name).indexOf(angular.lowercase($scope.search) || '') !== -1   );
        };

        // default sorting order is by Prospect start Date
        $scope.orderByField = 'StartDate';

        $scope.showClientInfo = function(prospect) {
            $rootScope.prospectToUpdate = prospect;
        };

        $http.get(baseURL + 'prospect/all/').success(function(data, status, headers, config) {
            $scope.prospects = data;
        }).error(function(data, status, header, config) {
        });
    })

    //  VolunteerCtrl to add Volunteer
    .controller('VolunteerCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;
        $scope.volunteerRole =
            [{
                value: 'Domain Advisor',
                name: 'Domain Advisor'
            }, {
                value: 'Technical Advisor',
                name: 'Technical Advisor'
            },{

                value: 'Probable Team Member',
                name: 'Probable Team Member'
            }]
        ;
        $scope.Role = 'Domain Advisor';
        $scope.changeRole = function() {
            console.log($scope.volunteerRole[2].value);
            if(angular.equals( $scope.Role, $scope.volunteerRole[2].value)){
                $scope.showDate=true;
            } else{
                $scope.showDate=false;
            }
        };

        $scope.addVolunteer = function() {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                UserID: $rootScope.currentUser,
                ParticipationRole :$scope.Role,
                AvailableDate: $scope.CreateDate,
                Notes: $scope.Notes
            };
            $http.post(baseURL + 'participant/', data = data).success(function(data, status, headers, config) {
                console.log('volunteer added.');
                $location.path('/prospects');
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('volunteer not added.');
            });
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    })

    .controller('ScheduleCallCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        var currentProspect = $rootScope.prospectToUpdate;
        console.log("current prospect:", currentProspect);

        $scope.typeOfCall =
            [{
                value: 'Internal Prep call',
                name: 'Internal Prep call'
            }, {
                value: 'Client engg call',
                name: 'Client engg call'
            }]
        ;
        $scope.call = 'Internal Prep call';

        $scope.displayParticipants = function() {
            console.log($scope.typeOfCall[1].value);
            if(angular.equals( $scope.call, $scope.typeOfCall[1].value)){
                $scope.showParticipants = true;

                $http.get(baseURL + 'participant/prospectid/' + currentProspect.ProspectID)
                    .success(function(data, status, headers, config) {
                        console.log("participants: ", data);
                        $rootScope.participants = data;
                        console.log("$rootScope.participants: ", $rootScope.participants);
                        $scope.participants = $rootScope.participants;
                        console.log("$scope.participants: ", $scope.participants);
                    }).error(function(data, status, header, config) {});
            }
            else{
                $scope.showParticipants = false;
            }
        };

        console.log("$rootScope.participants.ParticipationRole: ", $rootScope.participants);

        jQuery(function () {
            jQuery('#fromTime').datetimepicker();
            jQuery('#toTime').datetimepicker();
            jQuery("#fromTime").on("dp.change",function (e) {
                //jQuery('#toTime').data("DateTimePicker").setMinDate(e.date);
                $rootScope.ConfDateStart = e.date;
                console.log($rootScope.ConfDateStart);
            });
            jQuery("#toTime").on("dp.change",function (e) {
                //jQuery('#fromTime').data("DateTimePicker").setMaxDate(e.date);
                $rootScope.ConfDateEnd = e.date;
                console.log($rootScope.ConfDateEnd);
            });
        });

        var numberOfVolunteer = 0;
        var attendee_array;
        var attendees;
        var start = "{'email': ";
        var end;
        var attendee;
        var qoute = "'";

        $scope.scheduleCall = function() {
            var prospectData = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                Name: currentProspect.Name,
                ConfCalls:[
                {
                    ConfDateStart: $rootScope.ConfDateStart,
                    ConfDateEnd: $rootScope.ConfDateEnd,
                    ConfType: $scope.call
                }],
                TechStack: currentProspect.TechStack,
                Domain: currentProspect.Domain,
                DesiredTeamSize: currentProspect.DesiredTeamSize,
                Notes: currentProspect.Notes,
                CreateDate: currentProspect.CreateDate,
                SalesID: $rootScope.salesName
            };

            //console.log("ConfDate:", prospectData.ConfDateStart, prospectData.ConfDateEnd);
            console.log("Schedule call data:", JSON.stringify(prospectData));


            $http.put(baseURL + 'prospect/', data = prospectData).success(function (data, status, headers, config) {
                console.log('Call details added to Prospect.');
                checkAuth();
                $location.path('/prospects');
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('Error occurred.');
            });

            $http.get(baseURL + 'participant/prospectid/'+ currentProspect.ProspectID)
                .success(function(data, status, headers, config) {
                    console.log (data);
                    var participantData = JSON.stringify(data);
                    console.log("participantData: ", participantData);
                    if(JSON.parse(participantData) == null){
                        numberOfVolunteer  = 0;
                    }
                    else{
                        numberOfVolunteer = JSON.parse(participantData).length;
                    }
                    var volunteersList = JSON.parse(participantData);
                    console.log("volunteersList: ", volunteersList);

                    for(var i = 0; i < numberOfVolunteer; i++) {
                        if (i == numberOfVolunteer - 1) {
                            end = "} ";
                        } else {
                            end = "}, "
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
                    attendee_array = "[ " + attendees + " ]";

                }).error(function(data, status, header, config) {
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
                    'attendees': [
                        {
                            'email': 'shaila.pawar@synerzip.com'
                        },
                        {
                            'email': 'avnish.kumar@synerzip.com'
                        }
                    ],
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
                    function(fail){
                        alert(JSON.stringify({message: "fail", value: fail}));
                    });
            };
        };

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
        }
    });




