'use strict';

var module = angular.module('PreSales-Huddle', ['ngResource',
    'ngRoute'])

.config(function ($routeProvider) {
  $routeProvider.when('/prospects', {
    templateUrl: '../views/viewProspects.html',
    controller: 'ProspectsCtrl',
    title: 'All Prospects'
  })
  .when('/create', {
    templateUrl: '../views/addProspect.html',
    controller: 'AddProspectCtrl',
    title: 'Add Prospect'
  })
})
