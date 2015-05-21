module openmaths {
    'use strict';

    interface INavigationKeys {
        keyArrowDown: number;
        keyArrowUp: number;
        keyReturn: number;
    }

    interface IKeyboardEvent extends ng.IAngularEvent {
        keyCode: number;
    }

    interface ISearchResults {
        selected: number;
        data: Array<Object>;
    }

    let navigationKeys: INavigationKeys = {
        keyArrowDown: 40,
        keyArrowUp: 38,
        keyReturn: 13
    };

    export class SearchController {
        private Api: openmaths.Api;

        navigate: (event: IKeyboardEvent) => void;
        searchResults: ISearchResults;

        constructor(private _Api_: openmaths.Api, private $scope: ng.IScope) {
            this.Api = _Api_;

            this.searchResults = {
                selected: 0,
                data: []
            };

            this.navigate = (event) => {
                // @TODO
                // Get rid of this after development
                console.log(event);

                switch (event.keyCode) {
                    case navigationKeys.keyReturn:
                        // Trigger Callback with current model
                        event.preventDefault();
                        break;
                    case navigationKeys.keyArrowDown:
                        // Trigger results navigation downwards
                        event.preventDefault();
                        break;
                    case navigationKeys.keyArrowUp:
                        // Trigger results navigation upwards
                        event.preventDefault();
                        break;
                    default:
                        //this.search('t');
                        break;
                }
            };

            openmaths.ReactiveX.watchModel($scope, 'HomeCtr.name')
                .map(function (e: IReactiveXWatchModelCallbackArgs) {
                    return e.newValue;
                })
                .throttle(250)
                .map((term) => {
                    return Rx.Observable.fromPromise(this.searchPromise(term))
                        .do(() => {
                            openmaths.Logger.debug('Listing results for ' + term);
                        })
                        .catch((exception) => {
                            openmaths.Logger.error(exception);

                            return Rx.Observable.empty();
                        });
                })
                .switch()
                .map((data) => {
                    return openmaths.Api.response(data);
                })
                .retry(3)
                .subscribe((results) => {
                    openmaths.Logger.info(results);
                    this.searchResults = {
                        selected: 0,
                        data: results.data
                    }

                    console.log(this.searchResults);
                }, (errorData) => {
                    openmaths.Logger.error(errorData);
                });
        }

        searchPromise(term: string): ng.IHttpPromise<void> {
            // @TODO
            // abstract the search url into magic var
            return this.Api.get('search/' + term);
        }
    }

    angular
        .module('openmaths')
        .controller('SearchController', SearchController);
}