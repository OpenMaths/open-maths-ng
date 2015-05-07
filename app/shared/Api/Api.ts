/// <reference path="../../_ref.ts" />

// @TODO
// This service can only be used in combination with RxJS. I think we need an Rx intermediary,
// which will be responsible for creating observables from angular event streams (model change),
// as well as some which will be able to catch error codes and send corresponding response without
// terminating the stream and jumping right into the error handler (causes the app to time out).

module openmaths {
    'use strict';

    export interface ApiResponse {
        headers: Object;
        method: string;
        url: string;
        statusCode: number;
        status: string;
        data: any;
    }

    export class Api {
        private http: any;
        private api: string;

        constructor($http: ng.IHttpService) {
            this.http = $http;
            this.api = 'http://api.om.dev/';
        }

        get = (url: string, ignoreApi?: boolean): ng.IHttpPromise<void> => {
            return this.http.get((ignoreApi ? '' : this.api) + url);
        };

        post = (url: string, data: Object | string, ignoreApi?: boolean): ng.IHttpPromise<void> => {
            return this.http.post((ignoreApi ? '' : this.api) + url, data);
        };

        put = (url: string, data: Object | string, ignoreApi?: boolean): ng.IHttpPromise<void> => {
            return this.http.put((ignoreApi ? '' : this.api) + url, data);
        };

        // @TODO
        // We can possibly add all the verbs, but I guess there is no point in doing so unless we actually use them.

        static response = (d: ng.IHttpPromiseCallbackArg<any>, ignoreApi?: boolean): ApiResponse => {
            return {
                headers: d.config.headers,
                method: d.config.method,
                url: d.config.url,
                statusCode: d.status,
                status: ignoreApi ? d.statusText : _.first(_.keys(d.data)),
                data: ignoreApi ? d.data : _.first(_.values(d.data))
            };
        }
    }

    angular
        .module('openmaths')
        .service('Api', Api);
}