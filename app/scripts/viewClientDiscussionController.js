var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

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
    });