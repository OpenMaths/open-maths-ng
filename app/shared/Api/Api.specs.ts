module openmaths.specs {
    'use strict';

    describe('Api', () => {
        beforeEach(module('openmaths'));

        let Api: openmaths.Api;

        beforeEach(inject((_Api_: openmaths.Api) => {
            Api = _Api_;
        }));

        it('should be able to create a get request promise', () => {
            let get = Api.get;

            expect(get).toBeDefined();
        });

        it('should be able to create a post request promise', () => {
            let post = Api.post;

            expect(post).toBeDefined();
        });

        it('should be able to create a put request promise', () => {
            let put = Api.put;

            expect(put).toBeDefined();
        });

        it('should format Http response correctly', () => {
            let originalResponse = {
                config: {
                    headers: {
                        Accept: 'application/json, text/plain, */*'
                    },
                    method: 'GET',
                    url: 'https://api.github.com/users/slavomirvojacek/repos'
                },
                data: 'Hello World',
                status: 200,
                statusText: 'OK'
            };

            let parsedResponse = openmaths.Api.response(originalResponse, true);

            expect(parsedResponse).toEqual({
                headers: originalResponse.config.headers,
                method: originalResponse.config.method,
                url: originalResponse.config.url,
                statusCode: originalResponse.status,
                status: originalResponse.statusText,
                data: originalResponse.data
            });
        });
    });
}