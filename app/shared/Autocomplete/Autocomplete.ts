module openmaths {
    'use strict';

    export interface IAutocompleteDirectiveScope {
        placeholder: string;
    }

    export interface IAutocompleteAttributes extends ng.IAttributes {
        placeholder: string;
    }

    export class AutocompleteDirective implements ng.IDirective {
        restrict = 'E';
        templateUrl = 'app/shared/Autocomplete/autocomplete.html';
        scope = true;
        replace = true;
        link;

        constructor() {
            this.link = (scope: IAutocompleteDirectiveScope, element: ng.IRootElementService, attributes: IAutocompleteAttributes) => {
                scope.placeholder = attributes.placeholder;
            };
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