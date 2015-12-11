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

                    var profile = data.getBasicProfile();
                    $rootScope.currentUser = profile.getEmail();
                    $rootScope.currentUserImage = profile.getImageUrl();
                    $rootScope.salesName = profile.getName();

                    window.location = '#/prospects';
                    document.getElementById('signin').style.visibility='hidden';
                    document.getElementById('g-signinP').style.height = '0px';
                    document.getElementById('sign-out').style.visibility='visible';
                    document.getElementById('prospectList').style.visibility='visible';
                    document.getElementById('clientList').style.visibility='visible';
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
                });
        };
    })

    .controller('ProspectsCtrl', function($scope, $http, $rootScope) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';

        // default sorting order is by Prospect Creation Date
        $scope.orderByField = 'CreateDate';

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
    })

    .controller('AddProspectCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';

        $scope.maxDate = new Date();
        $scope.date = $scope.maxDate;
        console.log($scope.maxDate);

        $scope.addProspect = function() {

            console.log("In AddProspectCtrl, Creation Date: ", $scope.date);
            var data = {
                Name: $scope.prospectName,
                CreateDate : $scope.date,
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

        var prospect = $rootScope.prospectToUpdate;

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

        $scope.maxDate = new Date();
        $scope.StartDate = $scope.maxDate;

        var prospectFetched = $rootScope.prospectToUpdate;
        $scope.prospect = prospectFetched;

        $scope.addToClient = function() {
            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                Name: $scope.prospect.Name,
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
    });



