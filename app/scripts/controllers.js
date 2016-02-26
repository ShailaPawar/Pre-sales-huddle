var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";

angular.module('PreSales-Huddle')

    .controller('GoogleSignInCtrl', function($scope, $rootScope, $http, $location) {
        function googleLogin(){
            var auth2 = gapi.auth2.getAuthInstance();
            return auth2.signIn();
        }

        $scope.onSignIn = function() {
            googleLogin()
                .then(function (data) {
                    // The ID token you need to pass to your backend:
                    $rootScope.id_token = data.getAuthResponse().id_token;
                    //console.log("ID Token: " + $rootScope.id_token);

                    var profile = data.getBasicProfile();
                    $rootScope.currentUser = profile.getEmail();
                    $rootScope.currentUserName = profile.getName();
                    $rootScope.currentUserImage = profile.getImageUrl();
                    $rootScope.salesName = profile.getName();
                    console.log("$rootScope.getEmail",$rootScope.currentUser);

                    $rootScope.domainName = $rootScope.currentUser.substring( $rootScope.currentUser.indexOf('@'));
                    console.log("$rootScope.domainName",$rootScope.domainName);

                    if ( $rootScope.domainName != '@synerzip.com') {
                        $("#unauthorizedUserMOdal").modal({backdrop: "static"});
                    }
                    else{
                        document.getElementById('signin').style.visibility='hidden';
                        document.getElementById('g-signinP').style.height = '0px';
                        document.getElementById('sign-out').style.visibility='visible';
                        document.getElementById('prospectList').style.visibility='visible';
                        document.getElementById('clientList').style.visibility='visible';
                        document.getElementById('headerText').style.visibility='visible';
                        document.getElementById('reports').style.visibility='visible';
                        document.getElementById('notifications').style.visibility='visible';
                        document.getElementById('titleText').style.display='none'

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
                    }

                    $rootScope.firstName = $rootScope.salesName.substring(0, $rootScope.salesName.indexOf(' '));

                    $rootScope.userId = $rootScope.currentUser;

                    $rootScope.assignRole = "";

                    function addUser() {
                        $rootScope.assignRole = "Engineer";
                        var data = {
                            Email:         $rootScope.currentUser,
                            Notifications: [1,2,3,4,5,6,7,8,9],
                            Role:          $rootScope.assignRole
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
                return "This action will end your current session.";
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
    });


