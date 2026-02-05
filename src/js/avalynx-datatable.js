/**
 * AvalynxDataTable
 *
 * A simple, lightweight, and customizable data table for the web. Based on Bootstrap >=5.3 without any framework dependencies.
 *
 * @version 1.0.2
 * @license MIT
 * @author https://github.com/avalynx/avalynx-datatable/graphs/contributors
 * @website https://github.com/avalynx/
 * @repository https://github.com/avalynx/avalynx-datatable.git
 * @bugs https://github.com/avalynx/avalynx-datatable/issues
 *
 * @param {string} id - The ID of the element to attach the table to.
 * @param {object} options - An object containing the following keys:
 * @param {string} options.apiUrl - The URL to fetch the data from (default: null).
 * @param {string} options.apiMethod - The HTTP method to use when fetching data from the API (default: 'POST').
 * @param {object} options.apiParams - Additional parameters to send with the API request (default: {}).
 * @param {object} options.sorting - The initial sorting configuration for the table. Format is an array of objects specifying column and direction, e.g., [{"column": "name", "dir": "asc"}] (default: []).
 * @param {number} options.currentPage - The initial page number to display (default: 1).
 * @param {string} options.search - The initial search string to filter the table data (default: '').
 * @param {number} options.searchWait - The debounce time in milliseconds for search input to wait after the last keystroke before performing the search (default: 800).
 * @param {array} options.listPerPage - The list of options for the per-page dropdown (default: [10, 25, 50, 100]).
 * @param {number} options.perPage - The initial number of items per page (default: 10).
 * @param {string} options.className - The CSS classes to apply to the table (default: 'table table-striped table-bordered table-responsive').
 * @param {boolean} options.paginationPrevNext - Whether to show the previous and next buttons in the pagination (default: true).
 * @param {number} options.paginationRange - The number of pages to show on either side of the current page in the pagination (default: 2).
 * @param {object} options.loader - An instance of AvalynxLoader to use as the loader for the table (default: null).
 * @param {object} language - An object containing the following keys:
 * @param {string} language.showLabel - The label for the per-page select (default: 'Show').
 * @param {string} language.entriesLabel - The label next to the per-page select indicating what the numbers represent (default: 'entries').
 * @param {string} language.searchLabel - The label for the search input (default: 'Search').
 * @param {string} language.previousLabel - The label for the pagination's previous button (default: 'Previous').
 * @param {string} language.nextLabel - The label for the pagination's next button (default: 'Next').
 * @param {function} language.showingEntries - A function to format the text showing the range of visible entries out of the total (default: (start, end, total) => 'Showing ${start} to ${end} of ${total} entries').
 * @param {function} language.showingFilteredEntries - A function to format the text showing the range of visible entries out of the total when filtered (default: (start, end, filtered, total) => 'Showing ${start} to ${end} of ${filtered} entries (filtered from ${total} entries)').
 *
 */

class AvalynxDataTable {
    constructor(id, options = {}, language = {}) {
        this.dt = document.getElementById(id);
        if (!this.dt) {
            console.error(`AvalynxDataTable: Element with id '${id}' not found`);
            return;
        }
        this.id = id;

        this.options = {
            apiUrl: '',
            apiMethod: 'POST',
            apiParams: {},
            sorting: [],
            currentPage: 1,
            search: '',
            searchWait: 800,
            listPerPage: [10, 25, 50, 100],
            perPage: 10,
            className: 'table table-striped table-bordered table-responsive align-middle',
            paginationPrevNext: true,
            paginationRange: 2,
            loader: null,
            ...(options && typeof options === 'object' ? options : {})
        };

        this.language = {
            showLabel: "Show",
            entriesLabel: "entries",
            searchLabel: "Search",
            previousLabel: "Previous",
            nextLabel: "Next",
            showingEntries: (start, end, total) => `Showing ${start} to ${end} of ${total} entries`,
            showingFilteredEntries: (start, end, filtered, total) => `Showing ${start} to ${end} of ${filtered} entries (filtered from ${total} total entries)`,
            ...(language && typeof language === 'object' ? language : {})
        };
        if (!this.options.listPerPage.includes(this.options.perPage)) {
            this.options.perPage = this.options.listPerPage[0] || 10;
        }
        this.options.searchIsNew = false;
        this.result = null;
        this.totalPages = 0;
        this._boundHandlers = {
            sort: null,
            perPageChange: null,
            searchInput: null,
            searchDebounceTimeout: null
        };
        this.init();
        this.fetchData();
    }

    init() {
        this.ensureTemplatesExist();

        const topTemplate = document.getElementById("avalynx-datatable-top").content.cloneNode(true);
        const tableTemplate = document.getElementById("avalynx-datatable-table").content.cloneNode(true);
        const bottomTemplate = document.getElementById("avalynx-datatable-bottom").content.cloneNode(true);

        tableTemplate.querySelector("table").className = `${this.options.className} avalynx-datatable-table`;

        const topEntries = topTemplate.querySelector(".avalynx-datatable-top-entries");
        topEntries.querySelector("label:first-child").textContent = this.language.showLabel;
        topEntries.querySelector("label:last-child").textContent = this.language.entriesLabel;
        topTemplate.querySelector(".avalynx-datatable-top-search label").textContent = this.language.searchLabel;

        this.dt.append(topTemplate, tableTemplate, bottomTemplate);

        this.setupOverlayAndLoader();
        this.setupPerPageChangeEvent();
        this.setupSearchInputChangeEvent();
        this.setupSortingEvent();

        this.populatePerPageOptions();
        this.populateSearchInput();
    }

    async fetchData() {
        this.showLoader(true);

        try {
            const postData = {
                search: this.options.search,
                sorting: JSON.stringify(this.options.sorting),
                page: this.options.currentPage,
                perpage: this.options.perPage,
                searchisnew: this.options.searchIsNew ? 1 : 0,
                ...this.options.apiParams
            };

            let url = this.options.apiUrl;
            const fetchOptions = {
                method: this.options.apiMethod,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            };

            if (this.options.apiMethod === 'GET') {
                url += '?' + new URLSearchParams(postData).toString();
            } else {
                fetchOptions.body = new URLSearchParams(postData).toString();
            }

            const response = await fetch(url, fetchOptions);
            const data = await response.json();

            if (data.error) {
                console.error('AvalynxDataTable Error:', data.error);
                alert(data.error);
                return;
            }

            this.result = data;
            this.options.searchIsNew = false;
            this.options.currentPage = this.result.count.page;

            if (this.options.perPage !== this.result.count.perpage) {
                this.options.perPage = this.result.count.perpage;
                this.populatePerPageOptions();
            }

            this.totalPages = Math.ceil(this.result.count.filtered / this.result.count.perpage);
            this.populateTable();

            if (this.options.sorting !== this.result.sorting) {
                this.options.sorting = this.result.sorting;
                this.updateSortingIcons();
            }
        } catch (error) {
            console.error('AvalynxDataTable Error:', error);
            alert(error.message || error);
        } finally {
            this.showLoader(false);
        }
    }

    showLoader(show) {
        if (this.options.loader) {
            this.options.loader.load = show;
        } else {
            const overlay = document.getElementById(`${this.id}-overlay`);
            if (overlay) {
                overlay.style.display = show ? 'flex' : 'none';
            }
        }
    }

    ensureTemplatesExist() {
        const templates = {
            "avalynx-datatable-top": `
                <div class="d-flex flex-column flex-md-row avalynx-datatable-top">
                    <div class="d-flex align-self-center pb-2 avalynx-datatable-top-entries">
                        <label class="align-self-center"></label>
                        <div class="align-self-center px-2">
                            <select class="form-select"></select>
                        </div>
                        <label class="align-self-center"></label>
                    </div>
                    <div class="flex-grow-1"></div>
                    <div class="d-flex align-self-center pb-2 avalynx-datatable-top-search">
                        <label class="align-self-center"></label>
                        <div class="align-self-center ps-2"><input type="text" class="form-control"></div>
                    </div>
                </div>`,
            "avalynx-datatable-table": `
                <table>
                    <thead></thead>
                    <tbody></tbody>
                </table>`,
            "avalynx-datatable-bottom": `
                <div class="d-flex flex-column flex-md-row avalynx-datatable-bottom">
                    <div class="d-flex avalynx-datatable-bottom-entries pb-2"></div>
                    <div class="flex-grow-1"></div>
                    <nav class="align-self-center avalynx-datatable-bottom-pagination">
                        <ul class="pagination"></ul>
                    </nav>
                </div>`
        };

        for (const [id, content] of Object.entries(templates)) {
            if (!document.getElementById(id)) {
                const template = document.createElement('template');
                template.id = id;
                template.innerHTML = content;
                document.body.appendChild(template);
            }
        }
    }

    setupPerPageChangeEvent() {
        const select = this.dt.querySelector(".avalynx-datatable-top-entries .form-select");
        this._boundHandlers.perPageChange = (event) => {
            this.options.perPage = parseInt(event.target.value, 10);
            this.fetchData();
        };
        select.addEventListener('change', this._boundHandlers.perPageChange);
    }

    populatePerPageOptions() {
        const select = this.dt.querySelector(".avalynx-datatable-top-entries .form-select");
        select.innerHTML = this.options.listPerPage
            .map(num => `<option value="${num}"${num === this.options.perPage ? ' selected' : ''}>${num}</option>`)
            .join('');
    }

    setupSearchInputChangeEvent() {
        const searchInput = this.dt.querySelector(".avalynx-datatable-top-search .form-control");

        this._boundHandlers.searchInput = (event) => {
            clearTimeout(this._boundHandlers.searchDebounceTimeout);
            this._boundHandlers.searchDebounceTimeout = setTimeout(() => {
                const newValue = event.target.value;
                if (newValue !== this.options.search) {
                    this.options.searchIsNew = true;
                    this.options.search = newValue;
                    this.fetchData();
                }
            }, this.options.searchWait);
        };

        searchInput.addEventListener('input', this._boundHandlers.searchInput);
    }

    populateSearchInput() {
        const searchInput = this.dt.querySelector(".avalynx-datatable-top-search .form-control");
        searchInput.value = this.options.search;
    }

    populateTable() {
        const thead = this.dt.querySelector(".avalynx-datatable-table thead");
        const tbody = this.dt.querySelector(".avalynx-datatable-table tbody");

        const headerRow = document.createElement("tr");
        for (const column of this.result.head.columns) {
            const th = document.createElement("th");
            th.textContent = column.name;
            th.dataset.avalynxDatatableColumnId = column.id;

            if (column.hidden) th.classList.add("d-none");
            if (column.class) th.classList.add(column.class);
            if (column.sortable) {
                th.classList.add("avalynx-datatable-sorting");
                th.dataset.avalynxDatatableSortable = "true";
            }

            headerRow.appendChild(th);
        }
        thead.innerHTML = '';
        thead.appendChild(headerRow);

        const fragment = document.createDocumentFragment();
        for (const rowData of this.result.data) {
            const tr = document.createElement("tr");
            if (rowData.class) tr.classList.add(rowData.class);

            for (const column of this.result.head.columns) {
                const td = document.createElement("td");

                if (column.hidden) td.classList.add("d-none");
                if (column.class) td.classList.add(column.class);
                if (rowData.data_class?.[column.id]) td.classList.add(rowData.data_class[column.id]);

                if (column.raw) {
                    td.innerHTML = rowData.data[column.id];
                } else {
                    td.textContent = rowData.data[column.id];
                }

                tr.appendChild(td);
            }
            fragment.appendChild(tr);
        }
        tbody.innerHTML = '';
        tbody.appendChild(fragment);

        this.updateSortingIcons();
        this.populateShowEntries();
        this.populatePagination();
    }

    setupSortingEvent() {
        const thead = this.dt.querySelector(".avalynx-datatable-table thead");

        this._boundHandlers.sort = (event) => {
            const header = event.target.closest('th[data-avalynx-datatable-sortable]');
            if (!header) return;

            const columnId = header.dataset.avalynxDatatableColumnId;
            if (!columnId) return;

            const isMultiSort = event.ctrlKey || event.shiftKey;
            const currentDir = this.options.sorting[columnId];
            const newDir = currentDir === 'asc' ? 'desc' : 'asc';

            if (!isMultiSort) {
                this.options.sorting = {};
            }

            this.options.sorting[columnId] = newDir;
            this.fetchData();
        };

        thead.addEventListener('click', this._boundHandlers.sort);
    }

    updateSortingIcons() {
        const sortableHeaders = this.dt.querySelectorAll(".avalynx-datatable-table thead th[data-avalynx-datatable-sortable]");

        for (const header of sortableHeaders) {
            const columnId = header.dataset.avalynxDatatableColumnId;
            const sortDir = this.options.sorting[columnId];

            header.classList.remove('avalynx-datatable-sorting-asc', 'avalynx-datatable-sorting-desc');

            if (sortDir === 'asc') {
                header.classList.add('avalynx-datatable-sorting-asc');
            } else if (sortDir === 'desc') {
                header.classList.add('avalynx-datatable-sorting-desc');
            }
        }
    }

    populateShowEntries() {
        const entries = this.dt.querySelector(".avalynx-datatable-bottom-entries");
        const { start, end, filtered, all } = this.result.count;

        entries.textContent = filtered === all
            ? this.language.showingEntries(start, end, all)
            : this.language.showingFilteredEntries(start, end, filtered, all);
    }

    populatePagination() {
        const paginationUl = this.dt.querySelector(".avalynx-datatable-bottom-pagination ul");
        const fragment = document.createDocumentFragment();

        const { currentPage, paginationPrevNext, paginationRange } = this.options;

        if (paginationPrevNext) {
            this.createPaginationItem(fragment, currentPage - 1, this.language.previousLabel, currentPage === 1);
        }

        const startPage = Math.max(1, currentPage - paginationRange);
        const endPage = Math.min(currentPage + paginationRange, this.totalPages);

        for (let i = startPage; i <= endPage; i++) {
            this.createPaginationItem(fragment, i, i, false);
        }

        if (paginationPrevNext) {
            this.createPaginationItem(fragment, currentPage + 1, this.language.nextLabel, currentPage === this.totalPages);
        }

        paginationUl.innerHTML = '';
        paginationUl.appendChild(fragment);
    }

    createPaginationItem(container, pageNumber, text, disabled) {
        const li = document.createElement("li");
        li.className = `page-item${pageNumber === this.options.currentPage ? ' active' : ''}${disabled ? ' disabled' : ''}`;

        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = text;

        if (!disabled) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.options.currentPage = pageNumber;
                this.fetchData();
            });
        }

        li.appendChild(a);
        container.appendChild(li);
    }

    setupOverlayAndLoader() {
        if (this.options.loader) return;

        const overlay = document.createElement('div');
        overlay.id = `${this.id}-overlay`;
        Object.assign(overlay.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(var(--bs-body-bg-rgb, 0, 0, 0), 0.7)',
            zIndex: '1000'
        });

        overlay.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

        this.dt.style.position = 'relative';
        this.dt.appendChild(overlay);
    }

    refresh() {
        this.fetchData();
    }

    destroy() {
        clearTimeout(this._boundHandlers.searchDebounceTimeout);

        const thead = this.dt.querySelector(".avalynx-datatable-table thead");
        if (thead && this._boundHandlers.sort) {
            thead.removeEventListener('click', this._boundHandlers.sort);
        }

        const select = this.dt.querySelector(".avalynx-datatable-top-entries .form-select");
        if (select && this._boundHandlers.perPageChange) {
            select.removeEventListener('change', this._boundHandlers.perPageChange);
        }

        const searchInput = this.dt.querySelector(".avalynx-datatable-top-search .form-control");
        if (searchInput && this._boundHandlers.searchInput) {
            searchInput.removeEventListener('input', this._boundHandlers.searchInput);
        }

        this.dt.innerHTML = '';
        this.dt.style.position = '';

        this._boundHandlers = null;
        this.result = null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvalynxDataTable;
}
