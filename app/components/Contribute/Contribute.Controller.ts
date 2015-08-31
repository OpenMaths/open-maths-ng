module openmaths {
    'use strict';

    export interface IContributeControllerParams extends angular.ui.IStateParamsService {
        uriFriendlyTitle: string;
    }

    export class ContributeController {
        private static keyStrokeThrottle = 1500;
        private static retryConnection = 3;

        MutationForm: openmaths.MutationForm;
        MutationApi: openmaths.MutationApi;
        UpdateUmi: openmaths.UpdateUmi;

        parsingInProgress: boolean;

        constructor($scope: ng.IScope,
                    public $http: ng.IHttpService,
                    private NotificationFactory: openmaths.NotificationFactory,
                    private $stateParams?: IContributeControllerParams) {
            this.MutationApi = new openmaths.MutationApi(new openmaths.Api(this.$http), NotificationFactory);
            this.MutationForm = new openmaths.MutationForm;
            this.UpdateUmi = new openmaths.UpdateUmi(this.$stateParams, this.$http);

            this.parsingInProgress = false;

            if (this.UpdateUmi.updateUriFriendlyTitle) this.populateMutationForm();

            openmaths.ReactiveX.watchModel($scope, 'ContributeCtr.MutationForm.content.value')
                .map((e: IReactiveXWatchModelCallbackArgs) => e.newValue)
                .where(Rx.helpers.identity)
                .do(tempTerm => {
                    this.MutationForm.content.valueParsed = tempTerm;
                })
                .throttle(ContributeController.keyStrokeThrottle)
                .subscribe((expression: string) => {
                    this.parseContent();
                });

            $scope.$watch('ContributeCtr.MutationForm.prerequisiteDefinitionIds.value', (newValues: Object, oldValues: Object) => {
                if (_.keys(newValues).length > 0 || _.keys(oldValues).length > 0) this.parseContent();
            }, true);
        }

        toggleFormal() {
            this.MutationForm.advancedTypeOptions.value.formal = !this.MutationForm.advancedTypeOptions.value.formal;

            if (!this.MutationForm.advancedTypeOptions.value.formal) this.MutationForm.advancedTypeOptions.value.meta = false;

            this.parseContent();
        }

        toggleMeta() {
            this.MutationForm.advancedTypeOptions.value.meta = !this.MutationForm.advancedTypeOptions.value.meta;
            this.MutationForm.advancedTypeOptions.value.formal = this.MutationForm.advancedTypeOptions.value.meta;

            this.parseContent();
        }

        parseContent(): void {
            Rx.Observable
                .fromPromise(this.MutationApi.parseContent(this.MutationForm, !_.isUndefined(this.UpdateUmi.updateUriFriendlyTitle)))
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
                .retry(ContributeController.retryConnection)
                .subscribe(result => {
                    let response = openmaths.Api.response(result);

                    openmaths.Logger.info(response);

                    this.MutationForm.content.error = false;
                    this.MutationForm.content.valueParsed = response.data;

                    this.parsingInProgress = false;
                });
        }

        submitMutation() {
            _.isUndefined(this.UpdateUmi.updateUriFriendlyTitle) ?
                this.MutationApi.createContent(this.MutationForm) : this.MutationApi.updateContent(this.MutationForm);
        }

        private populateMutationForm() {
            Rx.Observable
                .fromPromise(this.UpdateUmi.getUmiByTitlePromise())
                .map(d => openmaths.Api.response(d))
                .where(Rx.helpers.identity)
                .retry(ContributeController.retryConnection)
                .subscribe((d: IApiResponse) => {
                    let response: IUmi = openmaths.Umi.umiTempFormatter(d.data);

                    this.MutationForm = new openmaths.MutationForm(new openmaths.Umi(response));
                    this.UpdateUmi.updateId = response.id;

                    openmaths.Logger.debug('UMI id => ' + response.id + ' loaded.');
                }, errorData => {
                    openmaths.Logger.error(errorData);
                    //this.NotificationFactory.generate('Requested contribution has not been found.', NotificationType.Error, errorData);
                });
        }
    }

    angular
        .module('openmaths')
        .controller('ContributeController', ContributeController);
}