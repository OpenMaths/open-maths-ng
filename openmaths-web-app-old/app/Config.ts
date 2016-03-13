interface Window {
    gApiInitialised: () => void;
}

let gApiAsync = () => {
    window.gApiInitialised();
};

module openmaths {
    'use strict';

    export interface IUiConfig {
        theme: string;
        font: string;
        currentState: ng.ui.ICurrentStateUiConfig;
    }

    interface IApiUrls {
        production: string;
        development: string;
        test: string;
    }

    // @TODO is this needed?
    interface IApiRoutes {
        check: string;
        checkUpdate: string;
        createUmi: string;
        getUmiById: string;
        getUmiByTitle: string;
        latexToHtml: string;
        search: string;
        update: string;
    }

    export class Config {
        private static localHost:string = 'om.dev';
        private static productionHost:string = 'app.openmaths.io';
        private static testHost:string = 'localhost:8087';

        private static apiRoutes:IApiRoutes = {
            check: 'check',
            checkUpdate: 'check-update',
            createUmi: 'add',
            getUmiById: 'id/',
            getUmiByTitle: 'title/',
            latexToHtml: 'latex-to-html',
            search: 'search/',
            update: 'update'
        };

        private static apiUrls:IApiUrls = {
            production: 'https://api.openmaths.io/',
            development: 'http://api.om.dev/',
            test: 'http://api.om.dev/'
        };

        private static staticUrls:IApiUrls = {
            production: 'https://static.openmaths.io/',
            development: 'http://static.om.dev/',
            test: 'http://static.om.dev/'
        };

        private static uiConfig:IUiConfig = {
            theme: 'light',
            font: 'modern',
            currentState: {}
        };

        static getApiUrl():string {
            return Config.apiUrls[openmaths.Debug.getEnvironment()];
        }

        static getStaticUrl():string {
            return Config.staticUrls[openmaths.Debug.getEnvironment()];
        }

        static getLocalHost():string {
            return Config.localHost;
        }

        static getProductionHost():string {
            return Config.productionHost;
        }

        static getTestHost():string {
            return Config.testHost;
        }

        static getApiRoutes():IApiRoutes {
            return Config.apiRoutes;
        }

        static getUiConfig():IUiConfig {
            const uiConfigCached:IUiConfig = LocalStorage.get('uiConfig');

            return {
                theme: uiConfigCached && uiConfigCached.theme ? uiConfigCached.theme : Config.uiConfig.theme,
                font: uiConfigCached && uiConfigCached.font ? uiConfigCached.font : Config.uiConfig.font,
                currentState: Config.uiConfig.currentState
            };
        }
    }
}