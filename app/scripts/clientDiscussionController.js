var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

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

    });