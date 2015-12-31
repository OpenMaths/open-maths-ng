/// <reference path='typings/tsd.d.ts' />

module openmaths {
    'use strict';

    angular.module('openmaths', ['ngSanitize', 'ui.router', 'angular-loading-bar'])
        .config(config)
        .run(run);

    function config($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider, cfpLoadingBarProvider) {
        $urlRouterProvider.otherwise('/e/');

        $stateProvider
            .state('editor', {
                url: '/editor/:uriFriendlyTitle',
                templateUrl: 'app/components/Contribute/contribute.html',
                controller: 'ContributeController',
                controllerAs: 'ContributeCtr',
                uiConfig: {
                    bodyClass: 'page-contribute',
                    navigation: {
                        hiding: false,
                        transparent: false
                    }
                }
            })
            .state('explore', {
                url: '/e/:uriFriendlyTitle',
                templateUrl: 'app/components/Explore/explore.html',
                controller: 'ExploreController',
                controllerAs: 'ExploreCtr',
                uiConfig: {
                    bodyClass: 'page-explore',
                    navigation: {
                        hiding: false,
                        transparent: true
                    }
                }
            })
            .state('explore.board', {
                uiConfig: {
                    bodyClass: 'page-explore',
                    navigation: {
                        hiding: true,
                        transparent: false
                    }
                }
            })
            .state('unauthorised', {
                url: '/unauthorised',
                templateUrl: 'app/components/Unauthorised/unauthorised.html',
                controller: 'UnauthorisedController',
                controllerAs: 'UnauthorisedCtr',
                uiConfig: {
                    bodyClass: 'page-unauthorised',
                    navigation: {
                        hiding: false,
                        transparent: true
                    }
                }
            });


        // @TODO
        // investigate whether it's not possible to set it somewhere in the module config
        cfpLoadingBarProvider.latencyThreshold = 1;
        cfpLoadingBarProvider.includeSpinner = false;
    }

    function run() {
        openmaths.Logger.debug('openmaths app is now running');
    }
}