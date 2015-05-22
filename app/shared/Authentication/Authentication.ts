module openmaths {
    'use strict';

    export interface IGApiAuthResult {
        access_token: string;
        code: string;
        error: any; // @TODO investigate
        status: {
            google_logged_in: boolean;
            method: string;
            signed_in: boolean;
        };
    }

    export class Authentication {
        constructor(public Api: openmaths.Api) {
        }

        gApiLogin() {
            // @TODO
            // when I've got time to faff around with mocking gapi, I will refactor this
            if (openmaths.Debug.getEnvironment() == 'test') {
                return false;
            }

            gapi.auth.signIn({
                callback: (authResult: IGApiAuthResult) => {
                    this.login(authResult, () => {
                        console.log('callback ok');
                    });
                }
            });
        }

        googleApiPromise(accessToken: string) {
            return this.Api.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken, true);
        }

        arftPromise(gPlusId: string) {
            return this.Api.post('arft', gPlusId);
        }

        loginPromise(loginData) {
            return this.Api.post('login', loginData);
        }

        login(gApiAuthResult: IGApiAuthResult, callback) {
            // @TODO
            // Think about gapi error handling here
            console.log(gApiAuthResult);

            //Rx.Observable.fromPromise();
            callback();
        }
    }

    angular
        .module('openmaths')
        .service('Authentication', openmaths.Authentication);
}