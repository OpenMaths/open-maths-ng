module openmaths.specs {
    'use strict';

    let Api: openmaths.Api;
    let arftGPlusId = '';
    let arftResponse = {};
    let googleApiToken = {access_token: 'helloWorld'};
    let googleApiResponse = {};
    let $httpBackend: ng.IHttpBackendService;
    let loginData = {
        arfToken: '',
        code: '',
        gmail: '',
        gPlusId: ''
    };
    let loginResponse = {};

    describe('Authentication', () => {
        beforeEach(module('openmaths'));

        beforeEach(inject((_Api_: openmaths.Api,
                           _$httpBackend_: ng.IHttpBackendService) => {
            Api = _Api_;
            $httpBackend = _$httpBackend_;
        }));

        it('should have the gApiLogin method', () => {
            expect(openmaths.Authentication.gApiLogin).toBeDefined();
        });

        it('should have the login method', () => {
            expect(openmaths.Authentication.login).toBeDefined();
        });

        it('should be able to return Google API promise', () => {
            $httpBackend.expectGET('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + googleApiToken.access_token)
                .respond(200, googleApiResponse);

            let promise = openmaths.Authentication.googleApiPromise(googleApiToken, Api);

            promise.then((result) => {
                expect(result.data).toEqual(googleApiResponse);
            });

            $httpBackend.flush();
        });

        it('should be able to return Anti Request Forgery Token promise', () => {
            $httpBackend.expectPOST('http://api.om.dev/arft', arftGPlusId)
                .respond(200, arftResponse);

            let promise = openmaths.Authentication.arftPromise(arftGPlusId, Api);

            promise.then((result) => {
                expect(result.data).toEqual(arftResponse);
            });

            $httpBackend.flush();
        });

        it('should be able to return Login promise', () => {
            $httpBackend.expectPOST('http://api.om.dev/login', loginData)
                .respond(200, loginResponse);

            let promise = openmaths.Authentication.loginPromise(loginData, Api);

            promise.then((result) => {
                expect(result.data).toEqual(loginResponse);
            });

            $httpBackend.flush();
        });
    });
}