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
        private static retryConnection = 3;

        private User: openmaths.User;

        constructor(public Api: openmaths.Api,
                    public NotificationFactory: openmaths.NotificationFactory) {
        }

        gApiLogin(callback: (accessToken: string, loginResponse: ILoginResponseData) => void) {
            // @TODO
            // when I've got time to faff about with mocking gapi, I will refactor this
            if (openmaths.Debug.getEnvironment() == 'test') {
                return false;
            }

            gapi.auth.signIn({
                callback: (authResult: IGApiAuthResponse) => {
                    this.login(authResult, callback);
                }
            });
        }

        gApiLogout(callback: () => void) {
            gapi.auth.signOut();

            this.logout(callback);
        }

        //userLoggedInCallback(loginResponse: ILoginResponseData, gApiAuthResponse: IGApiAuthResponse) {
        //    this.User = new openmaths.User(gApiAuthResponse, loginResponse.userInfo);
        //
        //    this.NotificationFactory.generate(loginResponse.loginResponse, NotificationType.Info);
        //}

        //userLoggedOutCallback() {
        //    this.User.signOut ? this.User.signOut() : openmaths.User.signOut();

            //this.NotificationFactory.generate(loginResponse.loginResponse, NotificationType.Info);
        //}

        googleApiPromise(accessToken: string) {
            return this.Api.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken, true);
        }

        // @TODO API config?
        arftPromise(gPlusId: string) {
            return this.Api.post('arft', gPlusId);
        }

        // @TODO API config?
        loginPromise(payload) {
            return this.Api.post('login', payload);
        }

        // @TODO API config?
        logoutPromise(payload: openmaths.Auth) {
            return this.Api.post('logout', payload);
        }

        login(gApiAuthResponse: IGApiAuthResponse, callback: (accessToken: string, loginResponse: ILoginResponseData) => void) {
            // @TODO
            // Think about gapi error handling here

            // gApiUserData stream
            Rx.Observable.fromPromise(this.googleApiPromise(gApiAuthResponse.access_token))
                .map((d) => {
                    let response = openmaths.Api.response(d, true),
                        userInfo: IGApiUserInfoResponse = response.data;

                    // ARFT Stream
                    return Rx.Observable.fromPromise(this.arftPromise(userInfo.id))
                        .map(d => {
                            let response = openmaths.Api.response(d);

                            return response.data;
                        })
                        .where(Rx.helpers.identity)
                        .retry(Authentication.retryConnection)
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
                            code: gApiAuthResponse.code,
                            gmail: userInfo.email,
                            gPlusId: userInfo.id
                        };

                    // Login stream
                    return Rx.Observable.fromPromise(this.loginPromise(loginData))
                        .map(d => {
                            let response = openmaths.Api.response(d);

                            return response.data;
                        })
                        .where(Rx.helpers.identity)
                        .retry(Authentication.retryConnection)
                        .map((loginResponse): ILoginResponseData => {
                            return {
                                loginResponse: loginResponse,
                                userInfo: userInfo
                            };
                        });
                })
                .switch()
                .retry(Authentication.retryConnection)
                .subscribe((d: ILoginResponseData) => {
                    openmaths.Logger.info(d);

                    callback(gApiAuthResponse.access_token, d);
                }, errorData => {
                    openmaths.Logger.error(errorData);
                });
        }

        logout(callback: () => void) {
            Rx.Observable.fromPromise(this.logoutPromise(openmaths.User.getAuthData()))
                .map(d => {
                    let response = openmaths.Api.response(d);

                    return response.data;
                })
                .where(Rx.helpers.identity)
                .retry(Authentication.retryConnection)
                .subscribe((d) => {
                    openmaths.Logger.info(d);

                    callback();
                }, errorData => {
                    openmaths.Logger.error(errorData);
                });
        }
    }

    angular
        .module('openmaths')
        .service('Authentication', openmaths.Authentication);
}