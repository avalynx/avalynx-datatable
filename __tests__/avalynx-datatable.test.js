/**
 * AvalynxDataTable Jest Tests
 * Comprehensive test suite for all important functionality
 */

// Mock bootstrap dropdown
global.bootstrap = {
    Dropdown: jest.fn().mockImplementation(() => ({
        hide: jest.fn(),
        show: jest.fn()
    }))
};

const AvalynxDataTable = require('../src/js/avalynx-datatable.js');

// Mock fetch globally
global.fetch = jest.fn();

describe('AvalynxDataTable', () => {
    let consoleErrorSpy;
    let mockFetchResponse;

    beforeEach(() => {
        // Clear document body
        document.body.innerHTML = '';

        // Create a test element
        const testElement = document.createElement('div');
        testElement.id = 'test-datatable';
        document.body.appendChild(testElement);

        // Mock console.error
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Reset fetch mock
        mockFetchResponse = {
            head: {
                columns: [
                    { id: 'id', name: 'ID', sortable: true, hidden: false },
                    { id: 'name', name: 'Name', sortable: true, hidden: false },
                    { id: 'email', name: 'Email', sortable: false, hidden: false }
                ]
            },
            data: [
                { data: { id: '1', name: 'John Doe', email: 'john@example.com' } },
                { data: { id: '2', name: 'Jane Smith', email: 'jane@example.com' } }
            ],
            count: {
                page: 1,
                perpage: 10,
                start: 1,
                end: 2,
                total: 2,
                filtered: 2,
                all: 2
            },
            sorting: {}
        };

        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockFetchResponse)
        });

        // Clear all timers
        jest.clearAllTimers();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        jest.clearAllMocks();
        fetch.mockClear();
    });

    describe('Constructor', () => {
        test('should initialize with valid id and default options', async () => {
            const dt = new AvalynxDataTable('test-datatable', { apiUrl: 'http://test.com/api' });

            expect(dt.id).toBe('test-datatable');
            expect(dt.options.apiUrl).toBe('http://test.com/api');
            expect(dt.options.apiMethod).toBe('POST');
            expect(dt.options.currentPage).toBe(1);
            expect(dt.options.perPage).toBe(10);
            expect(dt.options.search).toBe('');
            expect(dt.options.searchWait).toBe(800);
            expect(dt.options.listPerPage).toEqual([10, 25, 50, 100]);
            expect(dt.options.paginationPrevNext).toBe(true);
            expect(dt.options.paginationRange).toBe(2);
        });

        test('should merge custom options with defaults', () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                apiMethod: 'GET',
                perPage: 25,
                search: 'test search',
                searchWait: 1000,
                currentPage: 2,
                paginationRange: 3
            });

            expect(dt.options.apiMethod).toBe('GET');
            expect(dt.options.perPage).toBe(25);
            expect(dt.options.search).toBe('test search');
            expect(dt.options.searchWait).toBe(1000);
            expect(dt.options.currentPage).toBe(2);
            expect(dt.options.paginationRange).toBe(3);
        });

        test('should log error and return if element with id not found', () => {
            const dt = new AvalynxDataTable('non-existent-id', { apiUrl: 'http://test.com/api' });

            expect(consoleErrorSpy).toHaveBeenCalledWith("AvalynxDataTable: Element with id 'non-existent-id' not found");
            expect(dt.dt).toBeNull();
        });

        test('should reset perPage to 10 if not in listPerPage', () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                perPage: 15,
                listPerPage: [10, 25, 50, 100]
            });

            expect(dt.options.perPage).toBe(10);
        });

        test('should accept custom language settings', () => {
            const dt = new AvalynxDataTable('test-datatable', { apiUrl: 'http://test.com/api' }, {
                showLabel: 'Zeige',
                entriesLabel: 'Einträge',
                searchLabel: 'Suche',
                previousLabel: 'Zurück',
                nextLabel: 'Weiter'
            });

            expect(dt.language.showLabel).toBe('Zeige');
            expect(dt.language.entriesLabel).toBe('Einträge');
            expect(dt.language.searchLabel).toBe('Suche');
            expect(dt.language.previousLabel).toBe('Zurück');
            expect(dt.language.nextLabel).toBe('Weiter');
        });
    });

    describe('Template Creation', () => {
        test('should create required templates if they do not exist', async () => {
            new AvalynxDataTable('test-datatable', { apiUrl: 'http://test.com/api' });

            await new Promise(resolve => setTimeout(resolve, 10));

            expect(document.getElementById('avalynx-datatable-top')).not.toBeNull();
            expect(document.getElementById('avalynx-datatable-table')).not.toBeNull();
            expect(document.getElementById('avalynx-datatable-bottom')).not.toBeNull();
        });

        test('should not duplicate templates if they already exist', () => {
            new AvalynxDataTable('test-datatable', { apiUrl: 'http://test.com/api' });

            const topTemplates = document.querySelectorAll('#avalynx-datatable-top');
            expect(topTemplates.length).toBe(1);
        });
    });

    describe('DOM Structure', () => {
        test('should create top section with per-page select and search input', async () => {
            new AvalynxDataTable('test-datatable', { apiUrl: 'http://test.com/api' });

            await new Promise(resolve => setTimeout(resolve, 10));

            const container = document.getElementById('test-datatable');
            const topSection = container.querySelector('.avalynx-datatable-top');
            const perPageSelect = topSection.querySelector('.form-select');
            const searchInput = topSection.querySelector('.form-control');

            expect(topSection).not.toBeNull();
            expect(perPageSelect).not.toBeNull();
            expect(searchInput).not.toBeNull();
        });

        test('should create table with proper structure', async () => {
            new AvalynxDataTable('test-datatable', { apiUrl: 'http://test.com/api' });

            await new Promise(resolve => setTimeout(resolve, 10));

            const container = document.getElementById('test-datatable');
            const table = container.querySelector('.avalynx-datatable-table');
            const thead = table.querySelector('thead');
            const tbody = table.querySelector('tbody');

            expect(table).not.toBeNull();
            expect(thead).not.toBeNull();
            expect(tbody).not.toBeNull();
        });

        test('should create bottom section with entries info and pagination', async () => {
            new AvalynxDataTable('test-datatable', { apiUrl: 'http://test.com/api' });

            await new Promise(resolve => setTimeout(resolve, 10));

            const container = document.getElementById('test-datatable');
            const bottomSection = container.querySelector('.avalynx-datatable-bottom');
            const entriesInfo = bottomSection.querySelector('.avalynx-datatable-bottom-entries');
            const pagination = bottomSection.querySelector('.avalynx-datatable-bottom-pagination');

            expect(bottomSection).not.toBeNull();
            expect(entriesInfo).not.toBeNull();
            expect(pagination).not.toBeNull();
        });

        test('should apply custom className to table', async () => {
            new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                className: 'custom-table-class'
            });

            await new Promise(resolve => setTimeout(resolve, 10));

            const table = document.querySelector('.avalynx-datatable-table');
            expect(table.classList.contains('custom-table-class')).toBe(true);
        });
    });

    describe('Per-Page Selection', () => {
        test('should populate per-page select with listPerPage options', async () => {
            new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                listPerPage: [5, 10, 20]
            });

            await new Promise(resolve => setTimeout(resolve, 10));

            const select = document.querySelector('.avalynx-datatable-top .form-select');
            const options = select.querySelectorAll('option');

            expect(options.length).toBe(3);
            expect(options[0].value).toBe('5');
            expect(options[1].value).toBe('10');
            expect(options[2].value).toBe('20');
        });

        test('should select current perPage value', async () => {
            // Mock response with perPage 25
            const customResponse = {
                ...mockFetchResponse,
                count: {
                    ...mockFetchResponse.count,
                    perpage: 25
                }
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(customResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                perPage: 25,
                listPerPage: [10, 25, 50, 100]
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const select = document.querySelector('.avalynx-datatable-top .form-select');
            expect(select.value).toBe('25');
        });
    });

    describe('Search Input', () => {
        test('should populate search input with initial search value', async () => {
            new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                search: 'initial search'
            });

            await new Promise(resolve => setTimeout(resolve, 10));

            const searchInput = document.querySelector('.avalynx-datatable-top .form-control');
            expect(searchInput.value).toBe('initial search');
        });

        test('should trigger search with debounce', (done) => {
            jest.useFakeTimers();

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                searchWait: 500
            });

            // Wait for initial setup
            jest.runAllTimers();

            const searchInput = document.querySelector('.avalynx-datatable-top .form-control');

            // Clear initial fetch call
            fetch.mockClear();

            // Simulate typing
            searchInput.value = 'test';
            searchInput.dispatchEvent(new Event('input'));

            // Should not call fetch immediately
            expect(fetch).not.toHaveBeenCalled();

            // Fast-forward time
            jest.advanceTimersByTime(500);

            // Now should have called fetch
            expect(fetch).toHaveBeenCalled();

            jest.useRealTimers();
            done();
        });
    });

    describe('Data Fetching', () => {
        test('should call fetch with correct POST parameters', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                apiMethod: 'POST',
                search: 'test',
                sorting: { name: 'asc' },
                currentPage: 2,
                perPage: 25,
                apiParams: { custom: 'value' }
            });

            await new Promise(resolve => setTimeout(resolve, 10));

            expect(fetch).toHaveBeenCalledWith(
                'http://test.com/api',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            );

            const callArgs = fetch.mock.calls[0][1];
            expect(callArgs.body).toContain('search=test');
            expect(callArgs.body).toContain('page=2');
            expect(callArgs.body).toContain('perpage=25');
            expect(callArgs.body).toContain('custom=value');
        });

        test('should call fetch with GET method and query parameters', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                apiMethod: 'GET',
                search: 'test',
                currentPage: 1,
                perPage: 10
            });

            await new Promise(resolve => setTimeout(resolve, 10));

            const callUrl = fetch.mock.calls[0][0];
            expect(callUrl).toContain('http://test.com/api?');
            expect(callUrl).toContain('search=test');
            expect(callUrl).toContain('page=1');
            expect(callUrl).toContain('perpage=10');
        });

        test('should show overlay during data fetch when loader is null', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            // Overlay should be created
            const overlay = document.getElementById('test-datatable-overlay');
            expect(overlay).not.toBeNull();
        });

        test('should handle fetch errors gracefully', async () => {
            const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            fetch.mockRejectedValueOnce(new Error('Network error'));

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            expect(alertSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalled();

            alertSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        test('should handle API error responses', async () => {
            const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({ error: 'API Error' })
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            expect(alertSpy).toHaveBeenCalledWith('API Error');

            alertSpy.mockRestore();
        });
    });

    describe('Table Population', () => {
        test('should populate table headers from API response', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const thead = document.querySelector('.avalynx-datatable-table thead');
            const headers = thead.querySelectorAll('th');

            expect(headers.length).toBe(3);
            expect(headers[0].textContent).toBe('ID');
            expect(headers[1].textContent).toBe('Name');
            expect(headers[2].textContent).toBe('Email');
        });

        test('should mark sortable columns', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const headers = document.querySelectorAll('.avalynx-datatable-table thead th');

            expect(headers[0].classList.contains('avalynx-datatable-sorting')).toBe(true);
            expect(headers[1].classList.contains('avalynx-datatable-sorting')).toBe(true);
            expect(headers[2].classList.contains('avalynx-datatable-sorting')).toBe(false);
        });

        test('should populate table body with data rows', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const tbody = document.querySelector('.avalynx-datatable-table tbody');
            const rows = tbody.querySelectorAll('tr');

            expect(rows.length).toBe(2);
            expect(rows[0].querySelectorAll('td').length).toBe(3);
        });

        test('should handle hidden columns', async () => {
            mockFetchResponse.head.columns[2].hidden = true;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const headers = document.querySelectorAll('.avalynx-datatable-table thead th');
            expect(headers[2].classList.contains('d-none')).toBe(true);
        });

        test('should handle raw HTML in cells when column.raw is true', async () => {
            mockFetchResponse.head.columns[1].raw = true;
            mockFetchResponse.data[0].data.name = '<strong>John Doe</strong>';

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const tbody = document.querySelector('.avalynx-datatable-table tbody');
            const cell = tbody.querySelector('tr:first-child td:nth-child(2)');

            expect(cell.innerHTML).toContain('<strong>');
        });

        test('should apply custom classes to columns', async () => {
            mockFetchResponse.head.columns[0].class = 'custom-column-class';

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const header = document.querySelector('.avalynx-datatable-table thead th:first-child');
            expect(header.classList.contains('custom-column-class')).toBe(true);
        });

        test('should apply custom classes to rows', async () => {
            mockFetchResponse.data[0].class = 'custom-row-class';

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const row = document.querySelector('.avalynx-datatable-table tbody tr:first-child');
            expect(row.classList.contains('custom-row-class')).toBe(true);
        });
    });

    describe('Sorting', () => {
        test('should add click event to sortable headers', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const sortableHeader = document.querySelector('.avalynx-datatable-table thead th[data-avalynx-datatable-sortable]');
            expect(sortableHeader).not.toBeNull();
        });

        test('should toggle sorting direction on header click', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            // Mock response with sorting applied
            const sortedResponse = {
                ...mockFetchResponse,
                sorting: { id: 'asc' }
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(sortedResponse)
            });

            const sortableHeader = document.querySelector('.avalynx-datatable-table thead th[data-avalynx-datatable-column-id="id"]');
            sortableHeader.click();

            await new Promise(resolve => setTimeout(resolve, 200));

            expect(fetch).toHaveBeenCalled();
            expect(dt.options.sorting.id).toBe('asc');
        });

        test('should update sorting icons based on sort direction', async () => {
            mockFetchResponse.sorting = { id: 'asc' };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const sortableHeader = document.querySelector('.avalynx-datatable-table thead th[data-avalynx-datatable-column-id="id"]');
            expect(sortableHeader.classList.contains('avalynx-datatable-sorting-asc')).toBe(true);
        });

        test('should clear other sorting when clicking without ctrl/shift', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                sorting: { id: 'asc', name: 'desc' }
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            // Mock response with only id sorting (toggled to desc)
            const sortedResponse = {
                ...mockFetchResponse,
                sorting: { id: 'desc' }
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(sortedResponse)
            });

            const idHeader = document.querySelector('.avalynx-datatable-table thead th[data-avalynx-datatable-column-id="id"]');
            idHeader.click();

            await new Promise(resolve => setTimeout(resolve, 200));

            // Should have only one sorting column after click (id toggled from asc to desc)
            expect(Object.keys(dt.options.sorting).length).toBe(1);
            expect(dt.options.sorting.id).toBe('desc');
        });
    });

    describe('Pagination', () => {
        test('should display pagination with correct number of pages', async () => {
            mockFetchResponse.count.filtered = 100;
            mockFetchResponse.count.perpage = 10;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const paginationItems = document.querySelectorAll('.pagination .page-item');
            expect(paginationItems.length).toBeGreaterThan(0);
        });

        test('should show previous and next buttons when paginationPrevNext is true', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                paginationPrevNext: true
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const prevButton = document.querySelector('.pagination .page-item:first-child .page-link');
            expect(prevButton.textContent).toContain('Previous');
        });

        test('should not show previous and next buttons when paginationPrevNext is false', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                paginationPrevNext: false
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const pageLinks = document.querySelectorAll('.pagination .page-link');
            const hasPrevNext = Array.from(pageLinks).some(link =>
                link.textContent === 'Previous' || link.textContent === 'Next'
            );
            expect(hasPrevNext).toBe(false);
        });

        test('should mark current page as active', async () => {
            mockFetchResponse.count.page = 2;
            mockFetchResponse.count.filtered = 100;
            mockFetchResponse.count.perpage = 10;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                currentPage: 2
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const activeItem = document.querySelector('.pagination .page-item.active .page-link');
            expect(activeItem).not.toBeNull();
            expect(activeItem.textContent).toBe('2');
        });

        test('should disable previous button on first page', async () => {
            mockFetchResponse.count.page = 1;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                currentPage: 1
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const prevButton = document.querySelector('.pagination .page-item:first-child');
            expect(prevButton.classList.contains('disabled')).toBe(true);
        });

        test('should respect paginationRange setting', async () => {
            mockFetchResponse.count.filtered = 100;
            mockFetchResponse.count.perpage = 10;
            mockFetchResponse.count.page = 5;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                currentPage: 5,
                paginationRange: 2,
                paginationPrevNext: false
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const pageItems = document.querySelectorAll('.pagination .page-item');
            // Should show 5 pages: 3, 4, 5, 6, 7 (range=2 means 2 on each side)
            expect(pageItems.length).toBeLessThanOrEqual(5);
        });
    });

    describe('Entries Display', () => {
        test('should display correct entries information', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const entriesInfo = document.querySelector('.avalynx-datatable-bottom-entries');
            expect(entriesInfo.textContent).toContain('Showing 1 to 2 of 2 entries');
        });

        test('should display filtered entries information when search is active', async () => {
            mockFetchResponse.count.filtered = 2;
            mockFetchResponse.count.all = 10;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                search: 'test'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const entriesInfo = document.querySelector('.avalynx-datatable-bottom-entries');
            expect(entriesInfo.textContent).toContain('filtered');
        });

        test('should use custom language functions for entries display', async () => {
            const customShowingEntries = jest.fn((start, end, total) => `Custom: ${start}-${end}/${total}`);

            const dt = new AvalynxDataTable('test-datatable',
                { apiUrl: 'http://test.com/api' },
                { showingEntries: customShowingEntries }
            );

            await new Promise(resolve => setTimeout(resolve, 200));

            expect(customShowingEntries).toHaveBeenCalled();
        });
    });

    describe('Event Handling', () => {
        test('should trigger fetchData on per-page change', async () => {
            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            // Mock response with updated perpage
            const updatedResponse = {
                ...mockFetchResponse,
                count: {
                    ...mockFetchResponse.count,
                    perpage: 25
                }
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(updatedResponse)
            });

            const select = document.querySelector('.avalynx-datatable-top .form-select');
            select.value = '25';
            select.dispatchEvent(new Event('change'));

            await new Promise(resolve => setTimeout(resolve, 200));

            expect(fetch).toHaveBeenCalled();
            expect(dt.options.perPage).toBe(25);
        });

        test('should trigger fetchData on pagination click', async () => {
            mockFetchResponse.count.filtered = 100;
            mockFetchResponse.count.perpage = 10;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));
            fetch.mockClear();

            const pageLinks = document.querySelectorAll('.pagination .page-link');
            const secondPageLink = Array.from(pageLinks).find(link => link.textContent === '2');

            if (secondPageLink) {
                secondPageLink.click();
                await new Promise(resolve => setTimeout(resolve, 10));
                expect(fetch).toHaveBeenCalled();
            }
        });
    });

    describe('Loader Integration', () => {
        test('should use external loader when provided', async () => {
            const mockLoader = {
                load: false
            };

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                loader: mockLoader
            });

            // During fetch, loader.load should be set to true
            expect(mockLoader.load).toBe(true);

            await new Promise(resolve => setTimeout(resolve, 200));

            // After fetch, loader.load should be set to false
            expect(mockLoader.load).toBe(false);
        });

        test('should not create overlay when external loader is provided', async () => {
            const mockLoader = {
                load: false
            };

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                loader: mockLoader
            });

            const overlay = document.getElementById('test-datatable-overlay');
            expect(overlay).toBeNull();
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty data response', async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    head: { columns: [] },
                    data: [],
                    count: {
                        page: 1,
                        perpage: 10,
                        start: 0,
                        end: 0,
                        total: 0,
                        filtered: 0,
                        all: 0
                    },
                    sorting: {}
                })
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const tbody = document.querySelector('.avalynx-datatable-table tbody');
            expect(tbody.children.length).toBe(0);
        });

        test('should handle missing optional column properties', async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    head: {
                        columns: [
                            { id: 'id', name: 'ID' } // Missing sortable, hidden, class properties
                        ]
                    },
                    data: [
                        { data: { id: '1' } }
                    ],
                    count: {
                        page: 1,
                        perpage: 10,
                        start: 1,
                        end: 1,
                        total: 1,
                        filtered: 1,
                        all: 1
                    },
                    sorting: {}
                })
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const header = document.querySelector('.avalynx-datatable-table thead th');
            expect(header).not.toBeNull();
            expect(header.textContent).toBe('ID');
        });

        test('should update perPage if response returns different value', async () => {
            mockFetchResponse.count.perpage = 50;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                perPage: 10
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            expect(dt.options.perPage).toBe(50);
        });

        test('should handle single page of data', async () => {
            mockFetchResponse.count.filtered = 5;
            mockFetchResponse.count.perpage = 10;

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            expect(dt.totalPages).toBe(1);
        });

        test('should handle data with custom cell classes', async () => {
            mockFetchResponse.data[0].data_class = {
                name: 'highlighted-cell'
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            });

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api'
            });

            await new Promise(resolve => setTimeout(resolve, 200));

            const cell = document.querySelector('.avalynx-datatable-table tbody tr:first-child td:nth-child(2)');
            expect(cell.classList.contains('highlighted-cell')).toBe(true);
        });

        test('should set searchIsNew flag when search value changes', (done) => {
            jest.useFakeTimers();

            const dt = new AvalynxDataTable('test-datatable', {
                apiUrl: 'http://test.com/api',
                searchWait: 500
            });

            // Wait for initial setup
            jest.runAllTimers();

            const searchInput = document.querySelector('.avalynx-datatable-top .form-control');
            searchInput.value = 'new search';
            searchInput.dispatchEvent(new Event('input'));

            jest.advanceTimersByTime(500);

            expect(dt.options.searchIsNew).toBe(true);

            jest.useRealTimers();
            done();
        });
    });
});
