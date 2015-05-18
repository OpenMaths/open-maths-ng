/// <reference path='_ref.ts' />

module openmaths {
    'use strict';

    angular.module('openmaths', ['ui.router', 'angular-loading-bar'])
        .config(config)
        .run(run);

    function config($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, cfpLoadingBarProvider) {
        $urlRouterProvider.otherwise('/dive');

        $stateProvider
            .state('home', {
                url: '',
                templateUrl: 'app/components/Home/home.html',
                controller: HomeController
            })
            .state('dive', {
                url: '/dive',
                templateUrl: 'app/components/Dive/dive.html'
            })
            .state('dive.list', {
                url: '/list',
                templateUrl: 'app/components/Dive/dive.list.html',
                controller: DiveController
            });

        cfpLoadingBarProvider.includeSpinner = false;
    }

    function run() {
        openmaths.Logger.debug(new Date() + ' openmaths app is now running');
    }
}