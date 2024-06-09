import { AvalynxDataTable } from '../dist/js/avalynx-datatable.esm.js';

describe('AvalynxDataTable', () => {
    let container;
    let avalynxDataTable;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-datatable';
        document.body.appendChild(container);

        avalynxDataTable = new AvalynxDataTable('test-datatable', {
            apiUrl: 'https://api.example.com/data',
            perPage: 10,
        });
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    test('should be created correctly', () => {
        expect(avalynxDataTable).toBeInstanceOf(AvalynxDataTable);
    });

    test('init should create required elements', () => {
        const top = container.querySelector('.avalynx-datatable-top');
        const table = container.querySelector('table.avalynx-datatable-table');
        const bottom = container.querySelector('.avalynx-datatable-bottom');
        expect(top).not.toBeNull();
        expect(table).not.toBeNull();
        expect(bottom).not.toBeNull();
    });

    test('fetchData should populate table with data', async () => {
        // Mock fetch response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    head: {
                        columns: [
                            { id: 'name', name: 'Name', sortable: true, hidden: false },
                            { id: 'age', name: 'Age', sortable: true, hidden: false },
                        ]
                    },
                    data: [
                        { data: { name: 'John Doe', age: 30 } },
                        { data: { name: 'Jane Doe', age: 25 } },
                    ],
                    count: { start: 1, end: 2, total: 2, filtered: 2, page: 1, perpage: 10 },
                    sorting: { name: 'asc' }
                })
            })
        );

        await avalynxDataTable.fetchData();

        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain('John Doe');
        expect(rows[1].textContent).toContain('Jane Doe');
    });

    test('pagination should work correctly', async () => {
        // Mock fetch response with multiple pages
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    head: {
                        columns: [
                            { id: 'name', name: 'Name', sortable: true, hidden: false },
                            { id: 'age', name: 'Age', sortable: true, hidden: false },
                        ]
                    },
                    data: [
                        { data: { name: 'John Doe', age: 30 } },
                    ],
                    count: { start: 1, end: 1, total: 20, filtered: 20, page: 1, perpage: 10 },
                    sorting: { name: 'asc' }
                })
            })
        );

        await avalynxDataTable.fetchData();

        const pagination = container.querySelectorAll('.pagination .page-item');
        expect(pagination.length).toBeGreaterThan(2); // Should have more than just prev/next buttons
    });

});
