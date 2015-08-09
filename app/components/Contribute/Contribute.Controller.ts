module openmaths {
    'use strict';

    export class ContributeController {
        MutationForm: openmaths.MutationForm;
        SubmitMutation: openmaths.SubmitMutation;

        parsingInProgress: boolean;

        constructor($scope: ng.IScope, $http: ng.IHttpService) {
            this.MutationForm = new openmaths.MutationForm;
            this.SubmitMutation = new openmaths.SubmitMutation(new openmaths.Api($http));

            openmaths.ReactiveX.watchModel($scope, 'ContributeCtr.MutationForm.content.value')
                .throttle(500)
                .map((e: IReactiveXWatchModelCallbackArgs) => e.newValue)
                .subscribe((d: string) => {
                    let data = {
                        auth: openmaths.SessionStorage.get('omUser'),
                        s: d
                    };

                    Rx.Observable.fromPromise(this.SubmitMutation.latexToHtmlPromise(data))
                        .do(() => {
                            openmaths.Logger.debug('LaTeX to HTML translation in progress');

                            this.parsingInProgress = true;
                        })
                        .catch(e => {
                            openmaths.Logger.error(e);

                            return Rx.Observable.empty();
                        })
                        .map(result => openmaths.Api.response(result))
                        .subscribe(result => {
                            console.log(result);

                            this.parsingInProgress = false;
                        });
                });
        }
    }

    angular
        .module('openmaths')
        .controller('ContributeController', ContributeController);
}