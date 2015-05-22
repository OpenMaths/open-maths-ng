module openmaths.specs {
    'use strict';

    let Api: openmaths.Api;
    let googleApiToken = {access_token: 'helloWorld'};
    let googleApiResponse = {};
    let $httpBackend: ng.IHttpBackendService;

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
    });
}