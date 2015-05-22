module openmaths.specs {
    'use strict';

    describe('Debug', () => {
        it('should be able to get the current host (localhost:9000, ...)', () => {
            let getHost = openmaths.Debug.getHost();

            expect(getHost).toBeDefined();
        });

        it('should be able to get the current host name (localhost, ...)', () => {
            let getHostName = openmaths.Debug.getHostName();

            expect(getHostName).toBeDefined();
        });

        it('should tell that we are in test environment when running tests', () => {
            let environment = openmaths.Debug.getEnvironment();

            expect(environment).toEqual('test');
        });

        it('should be able to tell we are not in production environment when on non-production host', () => {
            let devHosts = ['server', 'localhost:9000', 'om.dev', 'staging.openmaths.io', 'localhost'];

            _.forEach(devHosts, (host) => {
                let environment = openmaths.Debug.getEnvironment(host);

                expect(environment).toEqual('development');
            });
        });

        it('should be able to tell we are in production environment when on production host', () => {
            let prodHost = Config.getProductionHost(),
                environment = openmaths.Debug.getEnvironment(prodHost);

            expect(environment).toEqual('production');
        });
    });
}