var baseURL = "http://presaleshuddle:8080/";

angular.module('PreSales-Huddle')

    .controller('NotificationsCtrl', function ($scope, $http, $rootScope, $location) {

        // Cancel button function
        $scope.go = function (path) {
            $rootScope.lastform = "notifications";
            $location.path(path);
        }
    });