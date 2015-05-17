/// <reference path='Notification.ts' />

module openmaths.specs {
    'use strict';

    describe('NotificationFactory', function () {
        beforeEach(module('openmaths'));

        let $compile: ng.ICompileService;
        let $rootScope;
        let $scope: openmaths.INotificationDirectiveScope;
        let $templateCache: ng.ITemplateCacheService;

        let Notification: openmaths.NotificationFactory;

        beforeEach(inject((_$compile_: ng.ICompileService,
                           _$rootScope_: ng.IRootScopeService,
                           _$templateCache_: ng.ITemplateCacheService) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;

            $templateCache = _$templateCache_;

            //$scope = <any>$rootScope.$new();
            //let ele = angular.element('<notification></notification>');
            //ele = $compile(ele)($scope);
            //$scope.$digest();
            //$templateCache.put('app/shared/Notification/Template.html', '<div class="notification" ng-class="{active : act, info : notification.type == \'info\', warning : notification.type == \'warning\', error : notification.type == \'error\', success : notification.type == \'success\'}">{{ notification.message }}</div>');

            $templateCache.put('app/shared/Notification/Template.html', '<div class="notification" ng-class="{active : act, info : notification.type == \'info\', warning : notification.type == \'warning\', error : notification.type == \'error\', success : notification.type == \'success\'}">{{ notification.message }}</div>');

            Notification = new openmaths.NotificationFactory;
        }));

        it('should replace the element with the appropriate content', () => {


            //$scope = $rootScope;
            //let ele = angular.element('<notification></notification>');
            console.log('compile process');
            let ele = $compile('<notification></notification>')($rootScope);

            //$scope.$digest();

            expect(true).toBe(true);
        });

        //it('should add a callback to subscriptions', () => {
        //    var subscribe = Notification.subscribe((data) => {
        //        return data
        //    });
        //
        //    console.log(Notification.subscriptions);
        //});

        // A directive gets created, adds a callback to NotificationFactory subscriptions.
        //it('should create a directive template and add a callback to NotificationFactory subscriptions');

        // NotificationFactory.generate gets called with certain data and that same callback is triggered.
        //it('should execute the very callback with data provided to NotificationFactory.generate()');


        //var controller: openmaths.GlobalController;
        //var $scope: openmaths.IGlobalControllerScope;
        //var $rootScope;
        //var $state;
        //
        //beforeEach(inject((_$rootScope_: ng.IRootScopeService,
        //                   _$state_: ng.ui.IStateProvider,
        //                   $templateCache: ng.ITemplateCacheService) => {
        //    $state = _$state_;
        //    $rootScope = _$rootScope_;
        //    $scope = <any>$rootScope.$new();
        //    $templateCache.put('app/components/Dive/Dive.html', '');
        //
        //    controller = new openmaths.GlobalController($scope, $rootScope);
        //}));
        //
        //it('should create a new controller', () => {
        //    expect(controller).toBeDefined();
        //});
        //
        //it('should assign corresponding state properties (url, name) and classes on body when states get changed', () => {
        //    $state.go('dive');
        //    $rootScope.$digest();
        //
        //    var state: ng.ui.IState = $state.current;
        //    var bodyClass: string = $scope.bodyClass;
        //
        //    expect(state.url).toEqual('/dive');
        //    expect(state.name).toEqual('dive');
        //    expect(bodyClass).toEqual('page-dive');
        //});
    });
}