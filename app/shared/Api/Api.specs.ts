module openmaths.specs {
    'use strict';

    describe('Api', function () {
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
    });
}