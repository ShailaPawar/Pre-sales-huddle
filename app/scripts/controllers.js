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
                    document.getElementById('notifications').style.visibility='visible';
                    document.getElementById('titleText').style.display='none';

                    // The ID token you need to pass to your backend:
                    $rootScope.id_token = data.getAuthResponse().id_token;
                    console.log("ID Token: " + $rootScope.id_token);

                    var profile = data.getBasicProfile();
                    $rootScope.currentUser = profile.getEmail();
                    $rootScope.currentUserImage = profile.getImageUrl();
                    $rootScope.salesName = profile.getName();


                    //var connect_data = {
                    //    User: $rootScope.currentUser,
                    //    Token: $rootScope.id_token
                    //};
                    //$http.post("http://172.24.212.123:8080/connect/", data = connect_data).success(function(data, status, headers, config) {
                    //    console.log("data: ", data);
                    //    console.log('user authenticated.');
                    //}).error(function(data, status, headers, config) {
                    //    console.log('user not authenticated.');
                    //});


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
        document.getElementById('notifications').style.visibility='visible';
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
            console.log("In saveData() $rootScope.prospectToUpdate:",$rootScope.prospectToUpdate);

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

        function displayProspectList() {
            $http.get(baseURL + 'prospect/all/').success(function (data, status, headers, config) {
                var prospectData = JSON.stringify(data);
                var prospectList = JSON.parse(prospectData);
                var numberOfProspects = prospectList.length;
                for (var i = 0; i < numberOfProspects; i++) {
                    (function (index) {
                        $http.get(baseURL + 'participant/prospectid/' + prospectList[i].ProspectID)
                            .success(function (participantData, status, headers, config) {
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

                        $http.get(baseURL + 'discussion/prospectid/' + prospectList[i].ProspectID)
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
                console.log("prospectList", prospectList);
                console.log("all $scope.prospects", $scope.prospects);

            }).error(function (data, status, header, config) {
            });
        }

        displayProspectList();

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

            $http.put(baseURL + 'prospect/', data = data).success(function(data, status, headers, config) {
                console.log('Reminder for prospect is set.');
                //$('#myModal').modal('hide');
                //$("#myModal").modal({backdrop: "static"});
                //displayProspectList();
                $location.path('/prospects');
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('Reminder for prospect is not set.');
            });

            $scope.numberOfDays = "";
            javascript:history.go(-1);
            //$location.path('/prospects');
        }

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
    })

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

        //$scope.$watch('creationDate', function(newVal, oldVal){
        //    $scope.creationDate = newVal;
        //    console.log($scope.creationDate);
        //})
        $scope.setCreateDate = function(prospectCreationDate) {
            console.log("prospectCreationDate: ", prospectCreationDate);
            return new Date(prospectCreationDate);
        };
        $scope.maxDate = new Date();
        console.log("In EditCtrl $rootScope.prospectToUpdate: ", $rootScope.prospectToUpdate);
        $scope.prospect = $rootScope.prospectToUpdate;

        $scope.editProspect = function() {
            //var n = $scope.prospect.CreateDate.toDateString();
            //var time = $scope.prospect.CreateDate.toLocaleTimeString();
            //var status = "Prospect created on " + n;
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
                ProspectStatus:     $rootScope.prospectToUpdate.ProspectStatus,
                SalesID:            $rootScope.salesName,
                StartDate:          $rootScope.prospectToUpdate.StartDate
            };
            console.log(data);

            $http.put(baseURL + 'prospect/', data = data).success(function(data, status, headers, config) {
                console.log('Prospect updated.');
                $("#myModal").modal({backdrop: "static"});
               /* $location.path('/prospects');*/
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('Prospect not updated.');
            });
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/prospects');
        }

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
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        var prospect = $rootScope.prospectToUpdate;
        $rootScope.prospect = prospect;
        $http.get(baseURL + 'discussion/prospectid/'+ prospect.ProspectID).success(function(data, status, headers, config) {
            console.log("discussion/prospectid/", data);
            var displayDiscussion = JSON.stringify( data);
            console.log("displayDiscussion", displayDiscussion);
            if (JSON.parse(displayDiscussion) != null) {
                $rootScope.msg = 0;
            }
            else{
                $rootScope.msg = 1;
            }
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
        };

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
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.StartDate = new Date();

        var prospectFetched = $rootScope.prospectToUpdate;
        console.log("prospectFetched: ", prospectFetched);
        $scope.prospect = prospectFetched;
        console.log("$scope.prospect: ", $scope.prospect);

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
                ProspectStatus: prospectStatus
            };

            $http.put(baseURL + 'prospect/', data = data).success(function (data, status, headers, config) {
                console.log('Prospect converted to Client.');
                $("#myModal").modal({backdrop: "static"});
                /*$location.path('/prospects');*/
            }).error(function (data, status, headers, config) {
                console.log('Prospect not converted to Client.');
            });
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/clients');
        }

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
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        var prospectFetched = $rootScope.prospectToUpdate;
        $scope.prospect = prospectFetched;
        console.log("$scope.prospect: ", $scope.prospect)

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
        document.getElementById('notifications').style.visibility='visible';
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

        //$scope.saveData = function(prospect) {
        //    console.log(prospect);
        //    $rootScope.prospectToUpdate = prospect;
        //    console.log($rootScope.prospectToUpdate);
        //
        //    // creation date
        //    $rootScope.createDate = $rootScope.prospectToUpdate.CreateDate.toString();
        //    $rootScope.createDate = $rootScope.createDate.split('T')[0];
        //    $rootScope.createDate = new Date($rootScope.createDate);
        //
        //    $rootScope.prospectToUpdate.CreateDate = $rootScope.createDate;
        //
        //    // start date
        //    $rootScope.startDate = $rootScope.prospectToUpdate.StartDate.toString();
        //    $rootScope.startDate = $rootScope.startDate.split('T')[0];
        //    $rootScope.startDate = new Date($rootScope.startDate);
        //
        //    $rootScope.prospectToUpdate.StartDate = $rootScope.startDate;
        //
        //};

        $http.get(baseURL + 'prospect/all/').success(function (data, status, headers, config) {
            $scope.prospects = data;
            console.log("client list",$scope.prospects);
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
                $("#myModal").modal({backdrop: "static"});
              /*  $location.path('/prospects');*/
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('volunteer not added.');
            });
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/prospects');
        }

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
        document.getElementById('notifications').style.visibility='visible';
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
           /* $("#myModal11").modal("show");*/
            $http.post(baseURL + 'discussion/answer', data = data).success(function (data, status, headers, config) {
                console.log('discussion updated.', data);
                console.log('discussion updated.');
                $("#myModal").modal("show");
                /*$location.path('/discussions');*/
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                console.log('discussion not updated.');
            });
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/discussions');
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
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;

        // Cancel button function
        $scope.go = function(path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);
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
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        console.log("in viewClientDiscussionCtrl ", $rootScope.prospectToUpdate);

        $rootScope.client = $rootScope.prospectToUpdate;
        console.log("in prospect");

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
        document.getElementById('notifications').style.visibility='visible';
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
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.prospect = $rootScope.prospectToUpdate;

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
                }(i));
            }
            $scope.prospects = prospectList;
            console.log("prospectList",prospectList);
            console.log("all $scope.prospects",$scope.prospects);
            var testArray = [];
            for( var j = 0; j < prospectList.length; j++ ){
                testArray[j] = prospectList[j].noOfVolunteers;

            }
            console.log(testArray);

        }).error(function(data, status, header, config) {});


    })
;


