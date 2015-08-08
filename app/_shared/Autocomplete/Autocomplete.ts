module openmaths {
    'use strict';

    export class AutocompleteDirective implements ng.IDirective {
        restrict = 'E';
        templateUrl = 'app/_shared/Autocomplete/autocomplete.html';
        scope = true;
        replace = true;

        constructor() {
        }

        static init() {
            return () => {
                return new AutocompleteDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('autocomplete', AutocompleteDirective.init());
}