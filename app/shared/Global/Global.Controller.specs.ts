module openmaths.specs {
	'use strict';

	describe('GlobalController', function () {
		beforeEach(module('openmaths'));

		var controller: openmaths.GlobalController;
		var $scope: openmaths.IGlobalControllerScope;
		var $rootScope;
		var $state;

		beforeEach(inject((_$rootScope_: ng.IRootScopeService,
		                   _$state_: ng.ui.IStateProvider,
		                   $templateCache: ng.ITemplateCacheService) => {
			$state = _$state_;
			$rootScope = _$rootScope_;
			$scope = <any>$rootScope.$new();
			$templateCache.put('app/components/Dive/Dive.html', '');

			controller = new openmaths.GlobalController($scope, $rootScope);
		}));

		it('should create a new controller', () => {
			expect(controller).toBeDefined();
		});

		it('should assign corresponding state properties (url, name) and classes on body when states get changed', () => {
			$state.go('dive');
			$rootScope.$digest();

			var state: ng.ui.IState = $state.current;
			var bodyClass: string = $scope.bodyClass;

			expect(state.url).toEqual('/dive');
			expect(state.name).toEqual('dive');
			expect(bodyClass).toEqual('page-dive');
		});
	});
}