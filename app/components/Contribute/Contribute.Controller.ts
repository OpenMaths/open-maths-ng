module openmaths {
    'use strict';

    export class ContributeController {
        MutationForm: openmaths.MutationForm;
        MutationApi: openmaths.MutationApi;

        parsingInProgress: boolean;

        constructor($scope: ng.IScope, public $http: ng.IHttpService) {
            this.MutationForm = new openmaths.MutationForm;
            this.MutationApi = new openmaths.MutationApi(new openmaths.Api(this.$http));

            this.parsingInProgress = false;

            openmaths.ReactiveX.watchModel($scope, 'ContributeCtr.MutationForm.content.value')
                .throttle(500)
                .map((e: IReactiveXWatchModelCallbackArgs) => e.newValue)
                .subscribe((expression: string) => {
                    this.parseContent();
                });

            $scope.$watch('ContributeCtr.MutationForm.prerequisiteDefinitionIds.value', (newValues: Object) => {
                if (_.keys(newValues).length > 0) this.parseContent();
            }, true);
        }

        toggleFormal() {
            this.MutationForm.advancedTypeOptions.value.formal = !this.MutationForm.advancedTypeOptions.value.formal;

            this.parseContent();
        }

        toggleMeta() {
            this.MutationForm.advancedTypeOptions.value.meta = !this.MutationForm.advancedTypeOptions.value.meta;

            this.parseContent();
        }

        parseContent(): void {
            Rx.Observable.fromPromise(this.MutationApi.parseContent(this.MutationForm))
                .do(() => {
                    openmaths.Logger.debug('LaTeX to HTML translation in progress');

                    // @TODO if does not work move up a level
                    this.parsingInProgress = true;
                })
                .catch(error => {
                    let response = openmaths.Api.response(error);

                    openmaths.Logger.error(response);

                    this.MutationForm.content.error = true;
                    this.MutationForm.content.valueParsed = response.data;

                    return Rx.Observable.empty();
                })
                .subscribe(result => {
                    let response = openmaths.Api.response(result);

                    openmaths.Logger.info(response);

                    this.MutationForm.content.error = false;
                    this.MutationForm.content.valueParsed = response.data;

                    this.parsingInProgress = false;
                });
        }

        createContent() {
            //this.MutationApi.createContent(this.MutationForm);
        }
    }

    angular
        .module('openmaths')
        .controller('ContributeController', ContributeController);
}