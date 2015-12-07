'use strict';

angular.module('PreSales-Huddle', ['ngResource', 'ngRoute'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider.when('/prospects', {
        templateUrl: '../views/viewProspects.html',
        controller: 'ProspectsCtrl',
        title: 'All Prospects'
    })
    .when('/edit', {
        templateUrl: '../views/editProspect.html',
        controller: 'EditProspectCtrl',
        title: 'Edit Prospect'
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
    .when('/create', {
        templateUrl: '../views/addProspect.html',
        controller: 'AddProspectCtrl',
        title: 'Add Prospect'
    });

//$httpProvider.interceptors.push('httpInterceptor');


});

//module.factory('httpInterceptor', function(){
//  return {
//    request : function (config) {
//        console.log(config);
//        return config;
//    },
//    response : function (response) {
//        return response;
//    }
//  }
//});
