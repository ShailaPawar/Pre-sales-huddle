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
            console.log("$rootScope.prospectToUpdate:",$rootScope.prospectToUpdate);

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
            var n = $scope.prospect.CreateDate.toDateString();
            var time = $scope.prospect.CreateDate.toLocaleTimeString();
            var status = "Prospect created on " + n;

            var data = {
                ProspectID:         $rootScope.prospectToUpdate.ProspectID,
                Name:               $scope.prospect.Name,
                CreateDate :        $scope.prospect.CreateDate,
                TechStack:          $scope.prospect.TechStack,
                Domain:             $scope.prospect.Domain,
                DesiredTeamSize:    $scope.prospect.DesiredTeamSize,
                ProspectNotes:      $scope.prospect.ProspectNotes,
                ConfCalls:          $rootScope.prospectToUpdate.ConfCalls,
                ProspectStatus:     status,
                SalesID:            $rootScope.salesName,
                StartDate:          $rootScope.prospectToUpdate.StartDate
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
                ProspectStatus: prospectFetched.ProspectStatus
            };

            $http.put(baseURL + 'prospect/', data = data).success(function (data, status, headers, config) {
                console.log('Prospect converted to Client.');
                $location.path('/prospects');
            }).error(function (data, status, headers, config) {
                console.log('Prospect not converted to Client.');
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
                },{
                    value: 'Volunteer participation for prospects',
                    name: 'Volunteer participation for prospects'
                }]
            ;
            $scope.reportType = 'Prospect addition per month';
            $scope.changeReport = function () {

                $rootScope.flag = 1;
                var testArray = [],a = [], i,split_array = [], trimmed_array = [], j, k, l, m, p,index,prospectCount = 0, clientsCount = 0;
                var countJan = 0, countFeb = 0, countMar = 0, countApr = 0, countMay = 0, countJun = 0,
                    countJul = 0, countAug = 0, countSept = 0, countOct = 0, countNov = 0, countDec = 0,countOne = 0,countTwo = 0,
                    countThreeToFive = 0,countFiveToTen = 0,countTenPlus = 0,countCreated = 0,countPrep = 0,countClient = 0;

                if ( angular.equals($scope.reportType, $scope.reportTypes[0].value) ) {

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

                else if ( angular.equals($scope.reportType, $scope.reportTypes[1].value) ) {

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
                    console.log(testArray);
                    for(  p = 10; p < testArray.length; p++){
                        index = testArray.indexOf(testArray[p]);
                        testArray.splice(index,1,"OTHER");
                    }
                   console.log(testArray);
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

                else if ( angular.equals($scope.reportType, $scope.reportTypes[2].value) ) {

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
                        /*trimmed_array[l] = testArray[l];
                        if (trimmed_array[l].indexOf(',') !== -1) {
                            index = testArray.indexOf(trimmed_array[l]);
                            testArray.splice(index, 1)
                        }*/
                        if (testArray[l].indexOf(',') == -1) {
                            trimmed_array.push(testArray[l]);
                        }
                    }
                    testArray = trimmed_array;

                    for ( m = 0; m < testArray.length; m++ ) {
                        testArray[m] = angular.uppercase(testArray[m]);
                        testArray[m] = testArray[m].replace(/^[\s,]+|[\s,]+$/g, '');
                    }

                    for(  p = 10; p < testArray.length; p++){
                        index = testArray.indexOf(testArray[p]);
                        testArray.splice(index,1,"OTHER");
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
                            Array

                        ]);
                    });
                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[3].value) ) {

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].DesiredTeamSize.toString();

                        if(testArray[i] == 1){

                            countOne++;
                        }
                        else if(testArray[i] == 2){
                            countTwo++;
                        }
                        else if(testArray[i] >= 3 && testArray[i] <= 5){
                            countThreeToFive++;
                        }
                        else if(testArray[i] >= 5 && testArray[i] <= 10){

                            countFiveToTen++;
                        }
                        else if(testArray[i] > 10){
                            countTenPlus++;
                        }

                    }
                   console.log(countThreeToFive);
                    /*var newArray = countArrayTeamSize(testArray);
                    console.log(newArray);*/
                    $(document).ready(function () {
                        /*var parentArray = $.map(newArray[0], function (value, index) {
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
                        });*/
                        RenderPieChartTeamSize('report-container', [
                            ['1' ,countOne],['2',countTwo],['3 - 5',countThreeToFive],
                            ['5 - 10',countFiveToTen],['10+',countTenPlus]
                        ]);
                    });

                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[4].value) ) {

                    for( i = 0; i < data.length; i++ ){
                        testArray[i] = data[i].SalesID;
                    }

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

                else if ( angular.equals($scope.reportType, $scope.reportTypes[5].value) ) {

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

                else if ( angular.equals($scope.reportType, $scope.reportTypes[6].value) ) {

                    for(  i = 0;i < data.length; i++ ){

                        testArray[i] = data[i].ProspectStatus;
                    }
                    console.log(testArray);
                    for( j = 0; j < testArray.length; j++){

                        if(testArray[j].indexOf('created') !== -1){
                            countCreated++;
                        }else if(testArray[j].indexOf('Prep') !== -1){

                            countPrep++;
                        }else if(testArray[j].indexOf('Client') !== -1){

                            countClient++;
                        }
                    }
                    $(document).ready(function () {

                        RenderPieChartProspectStatus('report-container', [
                            ['Propsect Created',countCreated],['Prep call scheduled',countPrep],
                            ['Client call scheduled',countClient]
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
                    },
                    colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                        '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1','#8c8c8c'],
                    title: {
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
                            borderColor: null,
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
                    },
                    colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                        '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1','#E5005A'],
                    title: {
                        text: 'Probable teamsize'
                    },
                    tooltip: {
                        formatter: function () {
                            return  'No. of people = <b>' + this.point.name + '</b>: ' + 'No. of teams = <b>'+ this.point.y ;
                        }
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'bottom',
                        layout: 'vertical',
                        borderColor:'black',
                        width:100,
                        itemStyle: {
                            fontSize:15
                        },
                        itemWidth:100,
                        borderWidth:1

                    },
                    plotOptions: {
                        pie: {

                            allowPointSelect: true,
                            innerSize: 170,
                            size:400,
                            center:[550,200],
                            cursor: 'pointer',
                            depth:55,
                            showInLegend: true,
                            dataLabels:{

                                formatter: function () {
                                    if (this.y != 0){
                                        return '<b>' + this.point.name + '</b>: '+ Highcharts.numberFormat(this.percentage, 2) + '%';
                                    }
                                    else{
                                        return null;
                                    }
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
                        showInLegend: false,
                       name:'No. of Prospects',
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
                },
                colors: ['#FFA500','#008000'],
                title: {
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

                                if (this.y != 0){
                                    return '<b>' + this.point.name + '</b>: '+ Highcharts.numberFormat(this.percentage, 2) + '%';
                                }
                                else{
                                    return null;
                                }
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
        function RenderPieChartProspectStatus(elementId, dataList) {
            new Highcharts.Chart({

                chart: {
                    renderTo: elementId,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height:600,
                    width:1140
                },
                colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                    '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1','#8c8c8c'],
                title: {
                    text: 'Volunteer participation for prospects'
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
                        borderColor: null,
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


