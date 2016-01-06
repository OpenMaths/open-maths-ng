module openmaths.specs {
    'use strict';

    describe('UpdateUmi model', () => {
        let
            $http:ng.IHttpService,
            model:openmaths.UpdateUmi;

        beforeEach(inject((_$http_:ng.IHttpService) => {
            $http = _$http_;

            model = new openmaths.UpdateUmi({
                uriFriendlyTitle: 'alias-alias'
            }, $http);
        }));

        it('should have getUmi promise attached', () => {
            expect(model.getUmiByIdPromise).toBeDefined();
        });

        it('should correctly evaluate updateUriFriendlyTitle', () => {
            expect(model.updateUriFriendlyTitle).toEqual('alias-alias');

            let undefinedUpdateUmi = new openmaths.UpdateUmi(undefined, $http);

            expect(undefinedUpdateUmi.updateUriFriendlyTitle).toBeUndefined();
        });
    });
}