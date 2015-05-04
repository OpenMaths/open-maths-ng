/// <reference path='Global.Controller.ts' />

module openmaths.specs {
	'use strict';

	describe('GlobalController', function () {
		beforeEach(module('openmaths'));

		var controller: openmaths.GlobalController;
		var $scope: openmaths.GlobalControllerScope;
		var $rootScope;
		var $state;

		beforeEach(inject((_$rootScope_: ng.IRootScopeService,
		                   _$state_: ng.ui.IStateProvider,
		                   $templateCache: ng.ITemplateCacheService) => {
			$state = _$state_;
			$rootScope = _$rootScope_;
			$scope = <any>$rootScope.$new();
			$templateCache.put('/app/components/Dive/Dive.html', '');

			controller = new openmaths.GlobalController($scope, $rootScope);
		}));

		it('should create a new controller', () => {
			$state.go('dive');
			$rootScope.$digest();

			var state = $state.current;
			var bodyClass = $scope.bodyClass;

			expect(state.url).toEqual('/dive');
			expect(state.name).toEqual('dive');
			expect(bodyClass).toEqual('page-dive');
		});
	});
}