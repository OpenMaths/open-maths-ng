module openmaths.specs {
    'use strict';

    let Authentication: openmaths.Authentication;
    let arftGPlusId = '';
    let arftResponse = {};
    let googleApiToken = 'helloWorld';
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

        beforeEach(inject((_Authentication_: openmaths.Authentication,
                           _$httpBackend_: ng.IHttpBackendService) => {
            Authentication = _Authentication_;
            $httpBackend = _$httpBackend_;
        }));

        it('should have the gApiLogin method', () => {
            expect(Authentication.gApiLogin).toBeDefined();
        });

        it('should have the login method', () => {
            expect(Authentication.login).toBeDefined();
        });

        it('should be able to return Google API promise', () => {
            $httpBackend.expectGET('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + googleApiToken)
                .respond(200, googleApiResponse);

            let promise = Authentication.googleApiPromise(googleApiToken);

            promise.then((result) => {
                expect(result.data).toEqual(googleApiResponse);
            });

            $httpBackend.flush();
        });

        it('should be able to return Anti Request Forgery Token promise', () => {
            $httpBackend.expectPOST('http://api.om.dev/arft', arftGPlusId)
                .respond(200, arftResponse);

            let promise = Authentication.arftPromise(arftGPlusId);

            promise.then((result) => {
                expect(result.data).toEqual(arftResponse);
            });

            $httpBackend.flush();
        });

        it('should be able to return Login promise', () => {
            $httpBackend.expectPOST('http://api.om.dev/login', loginData)
                .respond(200, loginResponse);

            let promise = Authentication.loginPromise(loginData);

            promise.then((result) => {
                expect(result.data).toEqual(loginResponse);
            });

            $httpBackend.flush();
        });
    });
}