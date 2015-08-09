module openmaths {
    'use strict';

    interface IKeyboardEvent extends ng.IAngularEvent {
        keyCode: number;
    }

    export interface ISearchResult {
        id: string;
        title: string;
        uriFriendlyTitle: string;
        umiType: string;
    }

    export interface ISearchResults {
        selected: number;
        data: Array<ISearchResult>;
    }

    export interface IAutocompleteData {
        [id: string]: ISearchResult;
    }

    export enum NavigationKeys {
        keyArrowDown = 40,
        keyArrowUp = 38,
        keyReturn = 13
    }

    export class SearchController {
        private Api: openmaths.Api;

        trigger: (event: IKeyboardEvent, onReturn?: Function) => void;
        searchResults: ISearchResults;
        autocompleteData: IAutocompleteData;

        constructor(private _Api_: openmaths.Api, private $scope: ng.IScope) {
            this.Api = _Api_;

            this.searchResults = {
                selected: 0,
                data: []
            };

            this.autocompleteData = {};

            this.trigger = (event, onReturn) => {
                switch (event.keyCode) {
                    case NavigationKeys.keyReturn:
                        event.preventDefault();
                        onReturn ? onReturn(this.searchResults.data[this.searchResults.selected]) : this.updateAutocomplete('add');
                        break;
                    case NavigationKeys.keyArrowDown:
                        event.preventDefault();
                        this.navigate('down');
                        break;
                    case NavigationKeys.keyArrowUp:
                        event.preventDefault();
                        this.navigate('up');
                        break;
                    default:
                        break;
                }
            };

            // @TODO
            // potentially think about whether inheritance from another controller is going to affect the model
            // targeting. Should it only be something like SearchCtr.term?
            openmaths.ReactiveX.watchModel($scope, 'SearchCtr.term')
                .map((e: IReactiveXWatchModelCallbackArgs) => e.newValue)
                .where(Rx.helpers.identity)
                // @TODO
                // abstract into magic vars
                .throttle(250)
                .map(term => {
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
                .map(data => {
                    return openmaths.Api.response(data);
                })
                // @TODO
                // abstract into magic vars
                .retry(3)
                .subscribe(results => {
                    openmaths.Logger.info(results);

                    this.searchResults = {
                        selected: 0,
                        data: results.data
                    }
                }, errorData => {
                    openmaths.Logger.error(errorData);
                });
        }

        navigate(direction: string) {
            let searchResultsCount: number = this.searchResults.data.length,
                searchResultSelected: number = this.searchResults.selected,
                minimumResults: number = 0,
                maximumResults: number = searchResultsCount - 1,
                updateSelectedTo: number;

            switch (direction) {
                case 'up':
                    updateSelectedTo = searchResultSelected > minimumResults ? searchResultSelected - 1 : searchResultSelected;
                    break;
                default:
                    updateSelectedTo = searchResultSelected < maximumResults ? searchResultSelected + 1 : searchResultSelected;
                    break;
            }

            this.searchResults.selected = updateSelectedTo;
        }

        searchPromise(term: string): ng.IHttpPromise<void> {
            return this.Api.get(openmaths.Config.getApiRoutes().search + term);
        }

        updateAutocomplete(action: string, id?: string) {
            let selectedSearchResult = this.searchResults.data[this.searchResults.selected];

            switch (action) {
                case 'add':
                    this.autocompleteData[selectedSearchResult.id] = selectedSearchResult;
                    break;
                default:
                    delete this.autocompleteData[id];
                    break;
            }
        }
    }

    angular
        .module('openmaths')
        .controller('SearchController', SearchController);
}