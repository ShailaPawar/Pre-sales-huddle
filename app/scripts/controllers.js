// var baseURL = "http://172.24.212.123:8280/";
var baseURL = "http://presaleshuddle:8080/";

angular.module('PreSales-Huddle')

    .controller('GoogleSignInCtrl', function($scope, $rootScope, $location) {
        console.log("In Sign In Ctrl.");
        function googleLogin(){
            var auth2 = gapi.auth2.getAuthInstance();
            return auth2.signIn();
        }

        $scope.onSignIn = function() {
            googleLogin()
                .then(function (data) {
                    //console.log("data", data);
                    var profile = data.getBasicProfile();
                    //console.log(profile);
                    $rootScope.currentUser = profile.getEmail();
                    $rootScope.currentUserImage = profile.getImageUrl();
                    //console.log($rootScope.currentUser);
                    window.location = '#/prospects';
                    document.getElementById('signin').style.visibility='hidden';
                    document.getElementById('g-signinP').style.height = '0px';
                    document.getElementById('sign-out').style.visibility='visible';
                    document.getElementById('home').style.visibility='visible';
                }, function (err) {
                    console.log(err)
                });
        };
    })

    .controller('SignOutCtrl', function($scope, $rootScope, $location) {
        console.log("In Sign Out Controller.");
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
                        document.getElementById('home').style.visibility = 'hidden';
                });
        };
    })

    .controller('ProspectsCtrl', function($scope, $http, $rootScope) {

            document.getElementById('signin').style.visibility='hidden';
            document.getElementById('g-signinP').style.height = '0px';
            document.getElementById('sign-out').style.visibility='visible';
            document.getElementById('home').style.visibility='visible';
        // default sorting order is by Prospect Creation Date
        $scope.orderByField = 'CreateDate';

        $scope.saveData = function(prospect) {
            $rootScope.prospectToUpdate = prospect;

            $rootScope.createDate = $rootScope.prospectToUpdate.CreateDate.toString();
            $rootScope.createDate = $rootScope.createDate.split('T')[0];
            $rootScope.createDate = new Date($rootScope.createDate);

            $rootScope.prospectToUpdate.CreateDate = $rootScope.createDate;

        };

        $http.get(baseURL + 'prospect/all/').success(function(data, status, headers, config) {
            $scope.prospects = data;
        }).error(function(data, status, header, config) {
        });
    })

    .controller('AddProspectCtrl', function($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('home').style.visibility='visible';

        $scope.maxDate = new Date();
        $scope.date = $scope.maxDate;
        console.log($scope.maxDate);

        $scope.addProspect = function() {

            // var mydate = $scope.date.toString();
            // var date = mydate.split('T')[0];
            // console.log(date,typeof(date));
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
        document.getElementById('home').style.visibility='visible';

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
        document.getElementById('home').style.visibility='visible';

        console.log($rootScope.currentUser);

        $scope.addDiscussion = function() {

            var data = {
                ProspectID: $rootScope.prospectToUpdate.ProspectID,
                UserID: $rootScope.currentUser,
                Query: $scope.query
            };

            console.log(data);

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
        document.getElementById('home').style.visibility='visible';

        var prospect = $rootScope.prospectToUpdate;
        console.log(prospect);

        $http.get(baseURL + 'discussion/prospectid/' + prospect.ProspectID).success(function(data, status, headers, config) {
            console.log(data);
            $scope.discussions = data;
            console.log($scope.discussions);
        }).error(function(data, status, header, config) {});
    });



