var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";

angular.module('PreSales-Huddle')

    .controller('NotificationsCtrl', function ($scope, $http, $rootScope, $location) {

        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        var userNotification = $rootScope.currentUser;
        $http.get(baseURL + 'user/email/'+ userNotification ,{
            headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
        }).success(function (data, status, headers, config) {
                $rootScope.currentUserData = data;
                $scope.showPreviousNotification();
            }).error(function (data, status, header, config) {
        });

        $scope.showPreviousNotification = function () {

            $scope.preferenceArray = $rootScope.currentUserData.Notifications ;
            $scope.notificationOptions = [
                {
                    value: 3,
                    name: 'Prospect updated'
                },
                {
                    value: 4,
                    name: ' Question posted'
                },
                {
                    value: 5,
                    name: 'Question answered'
                },
                {
                    value: 6,
                    name: 'Someone volunteered'
                },
                {
                    value: 7,
                    name: 'Call scheduled'

                },
                {
                    value: 8,
                    name: 'Prospect went dead'
                },
                {
                    value: 9,
                    name: 'Prospect converted to client'
                }];

            if($scope.preferenceArray.indexOf(0) !== -1){
                $scope.SelectOne = 0;
            }
            else{
                $scope.SelectOne = 1;
            }

            $scope.preferenceArrayLength = $scope.preferenceArray.length;
            for(i= 0; i < $scope.preferenceArrayLength;i++ ){
                for(j=0; j < $scope.notificationOptions.length ;j++){
                    if($scope.preferenceArray.indexOf($scope.notificationOptions[j].value) !== -1)  {
                        $scope.notificationOptions[j].selected = true;
                    }
                }
            }
        }

        // Cancel button function
        $scope.go = function (path) {
            $rootScope.lastform = "notifications";
            $location.path(path);
        }

        $scope.setNotification = function () {
            $scope.notificationPreferenceArray = [];
            $scope.notificationPreferenceArray.push($scope.SelectOne);
            $scope.notificationPreferenceArray.push(2);
            angular.forEach($scope.notificationOptions, function(album){
                if (album.selected) $scope.notificationPreferenceArray.push(album.value);
            });

           console.log("$scope.notificationPreferenceArray",$scope.notificationPreferenceArray)
            var data = {
                Email:          $rootScope.currentUser,
                Notifications:  $scope.notificationPreferenceArray ,
                Role:           $rootScope.assignRole
            };

            $http.put(baseURL + 'user/notifications/', data = data, {
                headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
                 })
                .success(function (data, status, headers, config) {
                    $("#notificationModal").modal({backdrop: "static"});
                }).error(function (data, status, headers, config) {
                    console.log(data, status, headers, config);
                    console.log('Error occurred.');
                });
        }

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/viewProspects');
        };

    });

