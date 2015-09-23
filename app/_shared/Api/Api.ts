// @TODO
// This service can only be used in combination with RxJS. I think we need an Rx intermediary,
// which will be responsible for creating observables from angular event streams (model change),
// as well as some which will be able to catch error codes and send corresponding response without
// terminating the stream and jumping right into the error handler (causes the app to time out).

module openmaths {
    'use strict';

    export class IApiResponse {
        headers: Object;
        method: string;
        url: string;
        statusCode: number;
        status: string;
        data: any;

        constructor(response: ng.IHttpPromiseCallbackArg<any>, ignoreOpenMathsApi?: boolean) {
            this.headers = response.headers;
            this.method = response.config.method;
            this.url = response.config.url;
            this.statusCode = response.status;
            this.status = ignoreOpenMathsApi ? response.statusText : _.first(_.keys(response.data));
            this.data = ignoreOpenMathsApi ? response.data : _.first(_.values(response.data));
        }
    }

    export class Api {
        private http: any;
        private api: string;

        constructor(private $http: ng.IHttpService) {
            this.http = $http;
            this.api = openmaths.Config.getApiUrl();
        }

        get(url: string, ignoreOpenMathsApi?: boolean): ng.IHttpPromise<void> {
            return this.http.get((ignoreOpenMathsApi ? '' : this.api) + url);
        }

        post(url: string, data: Object | string, ignoreOpenMathsApi?: boolean): ng.IHttpPromise<void> {
            return this.http.post((ignoreOpenMathsApi ? '' : this.api) + url, data);
        }

        put(url: string, data: Object | string, ignoreOpenMathsApi?: boolean): ng.IHttpPromise<void> {
            return this.http.put((ignoreOpenMathsApi ? '' : this.api) + url, data);
        }

        static response(response: ng.IHttpPromiseCallbackArg<any>, ignoreOpenMathsApi?: boolean): IApiResponse {
            return new IApiResponse(response, ignoreOpenMathsApi);
        }
    }

    angular
        .module('openmaths')
        .service('Api', Api);
}