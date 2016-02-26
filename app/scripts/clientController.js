var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

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
    });