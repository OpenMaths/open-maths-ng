module openmaths {
    'use strict';

    export interface IApiUrls {
        production: string;
        development: string;
        test: string;
    }

    let productionHost: string = 'openmaths.io';
    let testHost: string = 'localhost:3100';
    let apiUrls: IApiUrls = {
        production: 'https://api.openmaths.io/',
        development: 'http://api.om.dev/',
        test: 'http://api.om.dev/'
    };

    export class Config {
        static getApiUrl(): string {
            return apiUrls[openmaths.Debug.getEnvironment()];
        }

        static getProductionHost(): string {
            return productionHost;
        }

        static getTestHost(): string {
            return testHost;
        }
    }
}