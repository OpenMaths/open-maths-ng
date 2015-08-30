/// <reference path='typings/tsd.d.ts' />

module openmaths {
    'use strict';

    angular.module('openmaths', ['ngSanitize', 'ui.router', 'angular-loading-bar'])
        .config(config)
        .run(run);

    function config($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, cfpLoadingBarProvider) {
        $urlRouterProvider.otherwise('/explore');

        $stateProvider
            .state('home', {
                url: '',
                templateUrl: 'app/components/Home/home.html',
                controller: 'HomeController',
                controllerAs: 'HomeCtr',
                uiConfig: {
                    navigation: {
                        hiding: false,
                        transparent: true
                    }
                }
            })
            .state('dive', {
                url: '/dive',
                templateUrl: 'app/components/Dive/dive.html',
                uiConfig: {
                    navigation: {
                        hiding: false,
                        transparent: false
                    }
                }
            })
            .state('dive.list', {
                url: '/list',
                templateUrl: 'app/components/Dive/dive.list.html',
                controller: 'DiveController',
                controllerAs: 'DiveCtr',
            })
            .state('contribute', {
                url: '/contribute',
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
            .state('update', {
                url: '/update/:uriFriendlyTitle',
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
                url: '/explore',
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
                url: '/:uriFriendlyTitle',
                //templateUrl: 'app/components/Explore/explore.html',
                //controller: 'ExploreController',
                //controllerAs: 'ExploreCtr',
                //params: ['uriFriendlyTitle'],
                uiConfig: {
                    bodyClass: 'page-explore',
                    navigation: {
                        hiding: true,
                        transparent: false
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