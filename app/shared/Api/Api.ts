/// <reference path="../../_ref.ts" />

module openmaths {
	'use strict';

	export class Api {
		private http: any;

		constructor($http: ng.IHttpService) {
			this.http = $http;
		}

		get(url: string) {
			return this.http.get(url);
		}
	}

	angular
		.module('openmaths')
		.service('Api', Api);
}