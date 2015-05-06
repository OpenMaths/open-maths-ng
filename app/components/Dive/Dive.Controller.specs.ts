/// <reference path='Dive.Controller.ts' />

module openmaths.specs {
	'use strict';

	describe('DiveController', function () {
		beforeEach(module('openmaths'));

		var controller: openmaths.DiveController;
		var $scope: openmaths.DiveControllerScope;
		var $rootScope;
		var $state;

		beforeEach(inject((_$rootScope_: ng.IRootScopeService,
		                   _$state_: ng.ui.IStateProvider) => {
			$state = _$state_;
			$rootScope = _$rootScope_;
			$scope = <any>$rootScope.$new();

			controller = new openmaths.DiveController($scope);
		}));

		it('should create a new controller', () => {
			expect(controller).toBeDefined();
		});

		it('should contain items array in its scope', () => {
			var items: Array<string> = $scope.items;

			expect(items).toEqual(['Item 1', 'Item 2']);
		});
	});
}