module openmaths.specs {
    'use strict';

    describe('Board model', () => {
        let model = new openmaths.Board();

        it('should have the correct state set', () => {
            expect(model.state).toEqual('explore.board');
        });

        it('should correctly fill the grid', () => {
            expect(model.grid.length).toEqual(model.rows.current);
            expect(model.grid[0].length).toEqual(model.columns.current);
        });

        it('should be possible to update the grid', () => {
            expect(model.updateGrid).toBeDefined();
        });

        //it ('should always correctly fill the grid (when updating rows/columns)', () => {
        //expect(controller.Board.grid.length).toBeDefined();
        //});
    });
}