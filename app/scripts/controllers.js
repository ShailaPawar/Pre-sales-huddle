//var baseURL = "http://presaleshuddle:8080/";
var baseURL = "http://golangwebservice-presales.rhcloud.com/";

angular.module('PreSales-Huddle')

    .controller('GoogleSignInCtrl', function($scope, $rootScope, $http, $location) {
        function googleLogin(){
            var auth2 = gapi.auth2.getAuthInstance();
            return auth2.signIn();
        }

        $scope.onSignIn = function() {
            googleLogin()
                .then(function (data) {
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
                    //console.log("ID Token: " + $rootScope.id_token);

                    var profile = data.getBasicProfile();
                    $rootScope.currentUser = profile.getEmail();
                    $rootScope.currentUserName = profile.getName();
                    $rootScope.currentUserImage = profile.getImageUrl();
                    $rootScope.salesName = profile.getName();
                    console.log("$rootScope.currentUserImage",$rootScope.currentUserImage);
                    // for user authentication
                    var connect_data = {
                        User: $rootScope.currentUser,
                        Token: $rootScope.id_token
                    };
                    $http.post(baseURL + "connect/", data = connect_data).success(function(data, status, headers, config) {
                        console.log("data: ", data);
                        console.log('user authenticated.');
                        $rootScope.authenticationData = data;
                        console.log("$rootScope.authenticationData: ", $rootScope.authenticationData);

                        getAllUsers();
                    }).error(function(data, status, headers, config) {
                        console.log('user not authenticated.');
                    });


                    $rootScope.firstName = $rootScope.salesName.substring(0, $rootScope.salesName.indexOf(' '));

                    $rootScope.userId = $rootScope.currentUser;

                    $rootScope.assignRole = "";

                    function addUser() {
                        $rootScope.assignRole = "Engineer";
                        var data = {
                            Email: $rootScope.currentUser,
                            Role: $rootScope.assignRole
                        };
                        $http.post(baseURL + 'user/', data = data,  {
                            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
                        }).success(function(data, status, headers, config) {
                            console.log('user added.');
                        }).error(function(data, status, headers, config) {
                            console.log('user not added.');
                        });
                    }

                    function getAllUsers() {
                        $http.get(baseURL + 'user/all/', {
                            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
                        }).success(function (data, status, headers, config) {
                            console.log ("all user :", data);
                            if (data != undefined) {
                                var allUsers = JSON.stringify(data);
                                allUsers = JSON.parse(allUsers);
                                var totalUsers = allUsers.length;

                                $rootScope.userExists = 0;
                                for (var i = 0; i < totalUsers; i++) {
                                    console.log(allUsers[i].Email);
                                    //console.log("$rootScope.currentUser", $rootScope.currentUser);
                                    if (angular.equals($rootScope.currentUser, allUsers[i].Email)) {
                                        //console.log("Already exists.");
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

                            $location.path('/viewProspects');
                        }).error(function (data, status, headers, config) {
                            console.log('problem while fetching user data.');
                        });
                    }
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
                });
        };

        function warning()
        {   $rootScope.currentUrl = $location.path();
            console.log("currentUrl",$rootScope.currentUrl);
            if( $scope.count != 1 && $rootScope.currentUrl != '' ){
                return "Sure you want to leave?(message)";
            }
        }
        window.onbeforeunload = warning;

        window.onunload = function (event) {
            if( $scope.count != 1 && $rootScope.currentUrl != '' ){
                if (typeof event == 'undefined') {
                    event = window.event;
                }
                if (event) {
                    window.location = '#';
                    window.location.reload();
                }
            }
        }
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
                $("#myModal").modal({backdrop: "static"});
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

       /* $scope.editContacts = function() {
            $rootScope.editProspectNotes = 0;
            $rootScope.editContactDetails = 1;
            $rootScope.editProspectData = 0;

        };*/

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/viewProspects');
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
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        var prospect = $rootScope.prospectToUpdate;
        $rootScope.prospect = prospect;
        $http.get(baseURL + 'discussion/prospectid/'+ prospect.ProspectID, {
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function(data, status, headers, config) {
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
            if($scope.query == undefined){
                $("#myModal1").modal({backdrop: "static"});
            } else {
                var data = {
                    ProspectID: $rootScope.prospectToUpdate.ProspectID,
                    UserID: $rootScope.salesName,
                    Query: $scope.query
                };
                console.log("addDiscussion", data);
                $http.post(baseURL + 'discussion/', data = data, {
                    headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
                }).success(function (data, status, headers, config) {
                    console.log('Discussion added.');
                    $location.path('/discussions');
                }).error(function (data, status, headers, config) {
                    console.log('Discussion not added.');
                });

                $scope.query = "";

                javascript:history.go(-1);
            }
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $("#myModal").modal({backdrop: "static"});
        };

        $scope.addDiscussionCancel = function() {
            $scope.query = "";
            $('body').removeClass('modal-open');
            $location.path('/discussions');
        };

        /*$scope.addDiscussion = function() {
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
        };*/

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
                $("#myModal").modal({backdrop: "static"});
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

        $scope.prospect = $rootScope.prospectToUpdate;
        console.log("$scope.prospect: ", $scope.prospect);
        $rootScope.showParticularClient = 1;
        $rootScope.showClientNotes = 0;

        $scope.viewClientNotes = function() {
            $rootScope.nameOfProspect = $scope.prospect.Name;
            $rootScope.showParticularClient = 0;
            $rootScope.showClientNotes = 1;
        };
        $scope.goToViewForm = function() {
            $rootScope.showParticularClient = 1;
            $rootScope.showClientNotes = 0;
        };

        // back button function
        $scope.go = function (path) {
            $rootScope.lastform = "createProspect";
            $location.path(path);

            //javascript:history.go(-1);
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
        $scope.orderByField = '-StartDate';

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

        $http.get(baseURL + 'prospect/all/', {
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function (data, status, headers, config) {
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
            if($scope.answer == undefined){
                $("#myModal1").modal("show");
            }
            else{
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
                $http.post(baseURL + 'discussion/answer', data = data, {
                headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
            }).success(function (data, status, headers, config) {
                        console.log('discussion updated.', data);
                        console.log('discussion updated.');
                        $("#myModal").modal("show");
                        /*$location.path('/discussions');*/
                    }).error(function (data, status, headers, config) {
                        console.log(data, status, headers, config);
                        console.log('discussion not updated.');
                    });
            }
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/discussions');
        };

        $scope.goBackToProspectDiss = function() {
            $('body').removeClass('modal-open');
            $location.path('/prospectDiscussion');
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

        $http.get(baseURL + 'discussion/prospectid/'+ $rootScope.client.ProspectID, {
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function(data, status, headers, config) {
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
;


