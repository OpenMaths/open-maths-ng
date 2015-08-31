module openmaths.specs {
    'use strict';

    describe('NotificationDirective', () => {
        beforeEach(angular.mock.module('openmaths'));

        let $compile: ng.ICompileService;
        let $rootScope;
        let $scope: INotificationDirectiveScope;
        let $templateCache;

        let element: ng.IAugmentedJQuery;
        let NotificationFactory: openmaths.NotificationFactory;

        beforeEach(inject((_$compile_: ng.ICompileService,
                           _$rootScope_: ng.IRootScopeService,
                           _$templateCache_: ng.ITemplateCacheService,
                           _NotificationFactory_: openmaths.NotificationFactory) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            NotificationFactory = _NotificationFactory_;
            $scope = $rootScope.$new();

            $templateCache.put('app/_shared/Notification/notification.html', '<div class="notification" ng-class="{active : act, info : notification.type == \'info\', warning : notification.type == \'warning\', error : notification.type == \'error\', success : notification.type == \'success\'}">{{ notification.message }}</div>');

            element = angular.element('<notification></notification>');

            $compile(element)($scope);
            $scope.$digest();
        }));

        it('should put one callback of type function into DirectiveFactory subscriptions array', () => {
            let subscriptions = NotificationFactory.subscriptions;

            expect(subscriptions.length).toEqual(1);
            expect(typeof(_.first(subscriptions))).toEqual('function');
        });

        it('should replace the element with the appropriate content when calling "info" notification', () => {
            NotificationFactory.generate('Hello World Info', NotificationType.Info);

            $compile(element)($scope);
            $scope.$digest();

            expect(element.hasClass('info')).toBe(true);
            expect(element.hasClass('active')).toBe(true);
            expect(element.html()).toEqual('Hello World Info');
        });

        it('should replace the element with the appropriate content when calling "warning" notification', () => {
            NotificationFactory.generate('Hello World Warning', NotificationType.Warning);

            $compile(element)($scope);
            $scope.$digest();

            expect(element.hasClass('warning')).toBe(true);
            expect(element.hasClass('active')).toBe(true);
            expect(element.html()).toEqual('Hello World Warning');
        });

        it('should replace the element with the appropriate content when calling "error" notification', () => {
            NotificationFactory.generate('Hello World Error', NotificationType.Error);

            $compile(element)($scope);
            $scope.$digest();

            expect(element.hasClass('error')).toBe(true);
            expect(element.hasClass('active')).toBe(true);
            expect(element.html()).toEqual('Hello World Error');
        });

        it('should replace the element with the appropriate content when calling "success" notification', () => {
            NotificationFactory.generate('Hello World Success', NotificationType.Success);

            $compile(element)($scope);
            $scope.$digest();

            expect(element.hasClass('success')).toBe(true);
            expect(element.hasClass('active')).toBe(true);
            expect(element.html()).toEqual('Hello World Success');
        });
    });
}