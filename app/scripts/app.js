'use strict';
angular.module('PreSales-Huddle', ['ngResource', 'ngRoute'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/viewProspects', {
                templateUrl: 'views/viewProspects.html',
                controller: 'ProspectsCtrl',
                title: 'All Prospects'
            })
            .when('/editProspect', {
                templateUrl: 'views/editProspect.html',
                controller: 'EditProspectCtrl',
                title: 'Edit Prospect'
            })
            .when('/createProspect', {
                templateUrl: 'views/addProspect.html',
                controller: 'AddProspectCtrl',
                title: 'Add Prospect'
            })
            .when('/discussions', { // view all discussions
                templateUrl: 'views/viewDiscussions.html',
                controller: 'DiscussionsCtrl',
                title: 'Discussions'
            })
            .when('/create', {
                templateUrl: 'views/addProspect.html',
                controller: 'AddProspectCtrl',
                title: 'Add Prospect'
            })
            .when('/addToClient', { // convertToClient
                templateUrl: 'views/addToClient.html',
                controller: 'AddClientCtrl',
                title: 'Add To Client'
            })

            .when('/clientInfo', {
                templateUrl: 'views/clientInfo.html',
                controller: 'ClientInfoCtrl',
                title: 'Client Information'
            })

            .when('/clients', {
                templateUrl: 'views/viewClients.html',
                controller: 'ClientCtrl',
                title: 'All Clients'
            })
            .when('/volunteer', {
                templateUrl: 'views/volunteer.html',
                controller: 'VolunteerCtrl',
                title: 'Volunteer'
            })
            .when('/prospectDiscussion', {
                templateUrl: 'views/prospectDiscussion.html',
                controller: 'ProspectDiscussionCtrl',
                title: 'Prospect Discussion'
            })
            .when('/scheduleCall', {
                templateUrl: 'views/scheduleCall.html',
                controller: 'ScheduleCallCtrl',
                title: 'Schedule a call'
            })
            .when('/viewParticularProspect', {
                templateUrl: 'views/viewParticularProspect.html',
                controller: 'ViewProspectCtrl',
                title: 'ReportsList'
            })
            .when('/reports', {
                templateUrl: 'views/reportsList.html',
                controller: 'ReportsListCtrl',
                title: 'prospect'
            })
            .when('/viewclientDiscussion', {
                templateUrl: 'views/viewClientDiscussion.html',
                controller: 'viewClientDiscussionCtrl',
                title: 'clientDiscussion'
            })
            .when('/clientDiscussion', {
                templateUrl: 'views/clientDiscussion.html',
                controller: 'clientDiscussionCtrl',
                title: 'clientDiscussion'
            })
            .when('/report-teamsize', {
                templateUrl: '../views/reportTeamSize.html',
                controller: 'ReportTeamsizeCtrl',
                title: 'reportTeamSize'
            })
            .when('/notifications', {
                templateUrl: 'views/notifications.html',
                controller: 'NotificationsCtrl',
                title: 'notifications'
            })
            .when('/deadProspect', {
                templateUrl: 'views/deadProspect.html',
                controller: 'DeadProspectCtrl',
                title: 'Dead prospect'
            })

        }).run(['$window', function ($window) {
            $window.GoogleAsyncInit = function () {
                // Executed when the SDK is loaded
                gapi.load('auth2', function () {
                    gapi.auth2.init();
                });
            };

        //Load Google SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://apis.google.com/js/platform.js?onload=GoogleAsyncInit';
            //js.attributes ='defer async';
            js.setAttribute('defer', '');
            js.setAttribute('async', '');
            fjs.parentNode.insertBefore(js, fjs);

            //Add meta Tag with client ID
            var meta = document.createElement('meta');
            meta.name = 'google-signin-client_id';
            meta.content = "726910394043-ptmnorekimlpkmruvlbq1neqvpoenk6k.apps.googleusercontent.com";
            d.getElementsByTagName('head')[0].appendChild(meta);
        }(document, 'script', 'google-jssdk'));
    }]);
