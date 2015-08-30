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

        getUmiByTitlePromise(): ng.IHttpPromise<void> {
            let apiRoutes = openmaths.Config.getApiRoutes();

            return this.Api.get(apiRoutes.getUmiByTitle + this.updateUriFriendlyTitle);
        }
    }
}