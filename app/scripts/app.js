'use strict';

angular.module('PreSales-Huddle', ['ngResource', 'ngRoute'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider.when('/prospects', {
                templateUrl: '../views/viewProspects.html',
                controller: 'ProspectsCtrl',
                title: 'All Prospects'
            })
            .when('/editProspect', {
                templateUrl: '../views/editProspect.html',
                controller: 'EditProspectCtrl',
                title: 'Edit Prospect'
            })
            .when('/createProspect', {
                templateUrl: '../views/addProspect.html',
                controller: 'AddProspectCtrl',
                title: 'Add Prospect'
            })
            .when('/discussions', {
                templateUrl: '../views/viewDiscussions.html',
                controller: 'DiscussionsCtrl',
                title: 'Discussions'
            })
            .when('/addDiscussion', {
                templateUrl: '../views/addDiscussion.html',
                controller: 'AddDiscussionCtrl',
                title: 'Add Discussion'
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