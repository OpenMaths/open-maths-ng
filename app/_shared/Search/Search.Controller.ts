module openmaths {
    'use strict';

    interface IKeyboardEvent extends ng.IAngularEvent {
        keyCode: number;
    }

    export interface ISearchResults {
        selected: number;
        data: Array<SearchResult>;
    }

    export interface IAutocompleteData {
        [id: string]: SearchResult;
    }

    export enum NavigationKeys {
        keyArrowDown = 40,
        keyArrowUp = 38,
        keyReturn = 13
    }

    export class SearchResult {
        id: string;
        title: string;
        titleFormatted: string;
        uriFriendlyTitle: string;
        umiType: string;

        constructor(result, term?: string) {
            this.id = result.id;
            this.title = result.title;
            this.titleFormatted = term ? openmaths.Search.Utils.highlightSearchTerm(term, result.title) : result.title;
            this.uriFriendlyTitle = result.uriFriendlyTitle;
            this.umiType = result.umiType;
        }
    }

    export class SearchController {
        private static keyStrokeThrottle = 250;
        private static retryConnection = 3;

        private Api: openmaths.Api;

        autocompleteData: IAutocompleteData;
        searchResults: ISearchResults;
        term: string;
        trigger: (event: IKeyboardEvent, onReturn?: Function) => void;

        constructor(private _Api_: openmaths.Api, private $scope: ng.IScope) {
            this.Api = _Api_;

            this.searchResults = {
                selected: 0,
                data: []
            };

            this.autocompleteData = {};

            this.trigger = (event, onReturn: Function) => {
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

            openmaths.ReactiveX.watchModel($scope, 'SearchCtr.term')
                .map((e: IReactiveXWatchModelCallbackArgs) => e.newValue)
                .where(Rx.helpers.identity)
                .throttle(SearchController.keyStrokeThrottle)
                .map(term => {
                    this.term = term;

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
                .retry(SearchController.retryConnection)
                .subscribe(results => {
                    openmaths.Logger.info(results);

                    this.searchResults = {
                        selected: 0,
                        data: _.map(results.data, result => new SearchResult(result, this.term))
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