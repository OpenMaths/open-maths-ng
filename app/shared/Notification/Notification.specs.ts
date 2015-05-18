module openmaths.specs {
    'use strict';

    describe('NotificationDirective', () => {
        beforeEach(module('openmaths'));

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

            $templateCache.put('app/shared/Notification/notification.html', '<div class="notification" ng-class="{active : act, info : notification.type == \'info\', warning : notification.type == \'warning\', error : notification.type == \'error\', success : notification.type == \'success\'}">{{ notification.message }}</div>');

            element = angular.element('<notification></notification>');

            $compile(element)($scope);
            $scope.$digest();
        }));

        it ('should put one callback of type function into DirectiveFactory subscriptions array', () => {
            let subscriptions = NotificationFactory.subscriptions;

            expect(subscriptions.length).toEqual(1);
            expect(typeof(_.first(subscriptions))).toEqual('function');
        });

        it('should replace the element with the appropriate content', () => {
            let allowedTypes = ['info', 'warning', 'error', 'success'];

            _.forEach(allowedTypes, (type) => {
                NotificationFactory.generate('Hello World', type);

                $compile(element)($scope);
                $scope.$digest();

                expect(element.hasClass(type)).toBe(true);
                expect(element.hasClass('active')).toBe(true);
                expect(element.html()).toEqual('Hello World');
            });
        });

        it('should not add inappropriate classes if invalid data are provided', () => {
            let invalidTypes = ['foo', 'bar'];

            _.forEach(invalidTypes, (type) => {
                NotificationFactory.generate('Foo Bar', type);

                $compile(element)($scope);
                $scope.$digest();

                expect(element.hasClass(type)).toBe(false);
                expect(element.hasClass('info')).toBe(true);
                expect(element.hasClass('active')).toBe(true);
                expect(element.html()).toEqual('Foo Bar');
            });
        });
    });
}