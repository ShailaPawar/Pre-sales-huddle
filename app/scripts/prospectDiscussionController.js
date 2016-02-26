var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

    .controller('ProspectDiscussionCtrl', function ($scope, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility='visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';

        $scope.maxDate = new Date();
        $scope.prospect = $rootScope.prospectToUpdate;
        $scope.Role = 'Domain Advisor';

        $scope.discussion = $rootScope.discussionToView;
        console.log("$scope.discussion", $scope.discussion.Answers);
        $scope.answers = $rootScope.discussionToView.Answers;

        $scope.addAnswer = function () {
            if($scope.answer == undefined){
                $("#myModal1").modal("show");
            }
            else{
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
                /* $("#myModal11").modal("show");*/
                $http.post(baseURL + 'discussion/answer', data = data, {
                    headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
                }).success(function (data, status, headers, config) {
                        console.log('discussion updated.', data);
                        console.log('discussion updated.');
                        $("#myModal").modal("show");
                        /*$location.path('/discussions');*/
                    }).error(function (data, status, headers, config) {
                        console.log(data, status, headers, config);
                        console.log('discussion not updated.');
                    });
            }
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/discussions');
        };

        $scope.goBackToProspectDiss = function() {
            $('body').removeClass('modal-open');
            $location.path('/prospectDiscussion');
        }
    });