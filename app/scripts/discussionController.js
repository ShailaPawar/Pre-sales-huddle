var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

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

    });