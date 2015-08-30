module openmaths {
    'use strict';

    export class UpdateUmi {
        private Api: openmaths.Api;

        updateUriFriendlyTitle: string;
        updateId: string;

        constructor(private params: IContributeControllerParams, private $http: ng.IHttpService) {
            this.Api = new openmaths.Api(this.$http);

            this.updateUriFriendlyTitle = params && params.uriFriendlyTitle ? params.uriFriendlyTitle : undefined;
        }

        getUmiByTitlePromise(s?): ng.IHttpPromise<void> {
            return this.Api.get('');
        }

        initialiseUmi() {
            let apiRoutes = openmaths.Config.getApiRoutes();

            Rx.Observable.fromPromise(this.getUmiByTitlePromise(apiRoutes.getUmiByTitle + ''))
                .map(d => openmaths.Api.response(d))
                .where(Rx.helpers.identity)
                .subscribe((d: IApiResponse) => {
                    let response: IUmi = openmaths.Umi.umiTempFormatter(d.data);

                    this.updateId = response.id;
                    //this.MutationForm = new openmaths.MutationForm(new openmaths.Umi(response));

                    openmaths.Logger.debug('UMI id => ' + response.id + ' loaded.');
                }, errorData => {
                    //this.MutationForm = new openmaths.MutationForm;
                    openmaths.Logger.error(errorData);
                    //this.NotificationFactory.generate('Requested contribution has not been found.', NotificationType.Error, errorData);
                });
        }
    }
}