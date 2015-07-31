module openmaths {
    'use strict';

    export interface IGApiAuthResponse {
        access_token: string;
        code: string;
        error: any; // @TODO investigate
        status: {
            google_logged_in: boolean;
            method: string;
            signed_in: boolean;
        };
    }

    export interface IGApiUserInfoResponse {
        email: string;
        family_name: string;
        gender: string;
        given_name: string;
        id: string;
        link: string;
        locale: string;
        name: string;
        picture: string;
        verified_email: boolean;
    }

    export interface IArftResponseData {
        arftResponse: string;
        userInfo: IGApiUserInfoResponse;
    }

    export interface ILoginResponseData {
        loginResponse: string;
        userInfo: IGApiUserInfoResponse;
    }

    export interface ILoginData {
        arfToken: string;
        code: string;
        gmail: string;
        gPlusId: string;
    }

    export class Authentication {
        constructor(public Api: openmaths.Api,
                    public NotificationFactory: openmaths.NotificationFactory) {
        }

        gApiLogin() {
            // @TODO
            // when I've got time to faff about with mocking gapi, I will refactor this
            if (openmaths.Debug.getEnvironment() == 'test') {
                return false;
            }

            gapi.auth.signIn({
                callback: (authResult: IGApiAuthResponse) => {
                    this.login(authResult);
                }
            });
        }

        userLoggedInCallback(userInfo: IGApiUserInfoResponse) {
            this.NotificationFactory.generate('Callback OK!', NotificationType.Info, userInfo);
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

        login(gApiAuthResult: IGApiAuthResponse) {
            // @TODO
            // Think about gapi error handling here

            // gApiUserData stream
            Rx.Observable.fromPromise(this.googleApiPromise(gApiAuthResult.access_token))
                .map((d) => {
                    let response = openmaths.Api.response(d, true),
                        userInfo: IGApiUserInfoResponse = response.data;

                    // ARFT Stream
                    return Rx.Observable.fromPromise(this.arftPromise(userInfo.id))
                        .map((d) => {
                            let response = openmaths.Api.response(d),
                                arftResponse: string = response.data;

                            return arftResponse;
                        })
                        .where(Rx.helpers.identity)
                        .map((arftResponse): IArftResponseData => {
                            return {
                                arftResponse: arftResponse,
                                userInfo: userInfo
                            };
                        });
                })
                .switch()
                .map((d: IArftResponseData) => {
                    let arftResponse = d.arftResponse,
                        userInfo = d.userInfo,
                        loginData: ILoginData = {
                            arfToken: arftResponse,
                            code: gApiAuthResult.code,
                            gmail: userInfo.email,
                            gPlusId: userInfo.id
                        };

                    // Login stream
                    return Rx.Observable.fromPromise(this.loginPromise(loginData))
                        .map((d) => {
                            let response = openmaths.Api.response(d),
                                loginResponse: string = response.data;

                            return loginResponse;
                        })
                        .where(Rx.helpers.identity)
                        .map((loginResponse): ILoginResponseData => {
                            return {
                                loginResponse: loginResponse,
                                userInfo: userInfo
                            };
                        });
                })
                .switch()
                .subscribe((d: ILoginResponseData) => {
                    openmaths.Logger.info(d);

                    this.userLoggedInCallback(d.userInfo);
                }, (d) => {
                    openmaths.Logger.error(d);
                });
        }
    }

    angular
        .module('openmaths')
        .service('Authentication', openmaths.Authentication);
}