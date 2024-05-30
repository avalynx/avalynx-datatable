/**
 * AvalynxDataTable
 *
 * A simple, lightweight, and customizable data table for the web. Based on Bootstrap >=5.3 without any framework dependencies.
 *
 * @version 0.0.1
 * @license MIT
 * @author https://github.com/avalynx/avalynx-datatable/graphs/contributors
 * @website https://github.com/avalynx/
 * @repository https://github.com/avalynx/avalynx-datatable.git
 * @bugs https://github.com/avalynx/avalynx-datatable/issues
 *
 * @param {string} id - The ID of the element to attach the table to.
 * @param {object} options - An object containing the following keys:
 * @param {string} options.apiUrl - The URL to fetch the data from (default: null).
 * @param {object} options.apiMethod - The HTTP method to use when fetching data from the API (default: 'POST').
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
        if (this.dt === null) {
            console.error("AvalynxDataTable: Element with id '" + id + "' not found");
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
            className: 'table table-striped table-bordered table-responsive',
            paginationPrevNext: true,
            paginationRange: 2,
            loader: null,
            ...options
        }
        this.language = {
            showLabel: "Show",
            entriesLabel: "entries",
            searchLabel: "Search",
            previousLabel: "Previous",
            nextLabel: "Next",
            showingEntries: (start, end, total) => `Showing ${start} to ${end} of ${total} entries`,
            showingFilteredEntries: (start, end, filtered, total) => `Showing ${start} to ${end} of ${filtered} entries (filtered from ${total} total entries)`,
            ...language
        }
        if (!this.options.listPerPage.includes(options.perPage)) {
            this.options.perPage = 10;
        }
        this.options.searchIsNew = false;
        this.init();
        this.fetchData();
    }

    init() {
        this.ensureTemplatesExist();

        const template_avalynx_datatable_top = document.getElementById("avalynx-datatable-top").content.cloneNode(true);
        const template_avalynx_datatable_table = document.getElementById("avalynx-datatable-table").content.cloneNode(true);
        const template_avalynx_datatable_bottom = document.getElementById("avalynx-datatable-bottom").content.cloneNode(true);

        template_avalynx_datatable_table.querySelector("table").className = this.options.className + ' avalynx-datatable-table';

        template_avalynx_datatable_top.querySelector(".avalynx-datatable-top-entries label:first-child").textContent = this.language.showLabel;
        template_avalynx_datatable_top.querySelector(".avalynx-datatable-top-entries label:last-child").textContent = this.language.entriesLabel;
        template_avalynx_datatable_top.querySelector(".avalynx-datatable-top-search label").textContent = this.language.searchLabel;

        this.dt.append(template_avalynx_datatable_top, template_avalynx_datatable_table, template_avalynx_datatable_bottom);

        this.setupOverlayAndLoader();
        this.setupPerPageChangeEvent();
        this.setupSearchInputChangeEvent();

        this.populatePerPageOptions();
        this.populateSearchInput();
    }

    async fetchData() {
        if (this.options.loader === null) {
            const overlay = document.getElementById(`${this.id}-overlay`);
            overlay.style.display = 'flex';
        } else {
            this.options.loader.load=true;
        }

        try {
            const postData = {
                "search": this.options.search,
                "sorting": this.options.sorting,
                "page": this.options.currentPage,
                "perpage": this.options.perPage,
                "searchisnew": (this.options.searchIsNew === true) ? 1 : 0,
                ...this.options.apiParams
            };
            postData.sorting = JSON.stringify(postData.sorting);

            let url = this.options.apiUrl;
            let fetchOptions = {
                method: this.options.apiMethod,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            };

            if (this.options.apiMethod === 'GET') {
                const queryParams = new URLSearchParams(postData).toString();
                url += '?' + queryParams;
            } else {
                const formBody = Object.keys(postData).map(key => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]);
                }).join('&');
                fetchOptions.body = formBody;
            }

            const response = await fetch(url, fetchOptions);
            const data = await response.json();
            if (data.error) {
                alert(data.error);
                console.error('Error:', data.error);
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
            alert(error);
            console.error('Error:', error);
        } finally {
            if (this.options.loader === null) {
                const overlay = document.getElementById(`${this.id}-overlay`);
                if (overlay) {
                    overlay.style.display = 'none';
                }
            } else {
                this.options.loader.load = false;
            }
        }
    }

    ensureTemplatesExist() {
        this.addTemplateIfMissing("avalynx-datatable-top", `
<div class="d-flex flex-column flex-md-row avalynx-datatable-top">
	<div class="d-flex align-self-center pb-2 avalynx-datatable-top-entries">
		<label class="align-self-center">Show</label>
		<div class="align-self-center px-2">
			<select class="form-select"> </select>
		</div>
		<label class="align-self-center">entries</label>
	</div>
	<div class="flex-grow-1"></div>
	<div class="d-flex align-self-center pb-2 avalynx-datatable-top-search">
		<label class="align-self-center">Search</label>
		<div class="align-self-center ps-2"><input type="text" class="form-control"></div>
	</div>
</div>
        `);

        this.addTemplateIfMissing("avalynx-datatable-table", `
<table>
	<thead></thead>
	<tbody></tbody>
</table>
        `);

        this.addTemplateIfMissing("avalynx-datatable-bottom", `
<div class="d-flex flex-column flex-md-row avalynx-datatable-bottom">
	<div class="d-flex avalynx-datatable-bottom-entries pb-2"></div>
	<div class="flex-grow-1"></div>
	<nav class="align-self-center avalynx-datatable-bottom-pagination">
		<ul class="pagination"></ul>
	</nav>
</div>
        `);
    }

    addTemplateIfMissing(id, content) {
        if (!document.getElementById(id)) {
            const template = document.createElement('template');
            template.id = id;
            template.innerHTML = content;
            document.body.appendChild(template);
        }
    }

    setupPerPageChangeEvent() {
        const select = this.dt.querySelector(".avalynx-datatable-top .avalynx-datatable-top-entries .form-select");
        select.addEventListener('change', (event) => {
            this.options.perPage = parseInt(event.target.value);
            this.fetchData(this.options.currentPage);
        });
    }

    populatePerPageOptions() {
        const select = this.dt.querySelector(".avalynx-datatable-top .avalynx-datatable-top-entries .form-select");
        select.innerHTML = '';
        this.options.listPerPage.forEach((num) => {
            const option = document.createElement("option");
            option.value = num;
            option.textContent = num;
            if (num === this.options.perPage) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    setupSearchInputChangeEvent() {
        const searchInput = this.dt.querySelector(".avalynx-datatable-top .avalynx-datatable-top-search .form-control");
        let debounceTimeout;

        searchInput.addEventListener('input', (event) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                if (event.target.value !== this.options.search) {
                    this.options.searchIsNew = true;
                }
                this.options.search = event.target.value;
                this.fetchData(this.options.currentPage);
            }, this.options.searchWait);
        });
    }

    populateSearchInput() {
        const searchInput = this.dt.querySelector(".avalynx-datatable-top .avalynx-datatable-top-search .form-control");
        searchInput.value = this.options.search;
    }

    populateTable() {
        const thead = this.dt.querySelector(".avalynx-datatable-table thead");
        thead.innerHTML = '';
        const headerRow = document.createElement("tr");
        this.result.head.columns.forEach((column) => {
            const th = document.createElement("th");
            if (column.hidden) {
                th.classList.add("d-none");
            }
            th.textContent = column.name;
            th.setAttribute("data-avalynx-datatable-column-id", column.id);
            if (column.sortable) {
                th.classList.add("avalynx-datatable-sorting");
                th.setAttribute("data-avalynx-datatable-sortable", "true");
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        const tbody = this.dt.querySelector(".avalynx-datatable-table tbody");
        tbody.innerHTML = '';
        this.result.data.forEach((rowData) => {
            const tr = document.createElement("tr");
            this.result.head.columns.forEach((column) => {
                const td = document.createElement("td");
                if (column.hidden) {
                    td.classList.add("d-none");
                }
                td.textContent = rowData.data[column.id];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        this.setupSortingEvent();
        this.populateShowEntries();
        this.populatePagination();
    }

    setupSortingEvent() {
        const sortableHeaders = this.dt.querySelectorAll(".avalynx-datatable-table thead th[data-avalynx-datatable-sortable]");
        sortableHeaders.forEach(header => {
            header.addEventListener('click', (event) => {
                const columnId = header.getAttribute('data-avalynx-datatable-column-id');
                if (!columnId) return;
                const isCtrlPressed = event.ctrlKey;
                const isShiftPressed = event.shiftKey;
                if (this.options.sorting[columnId]) {
                    let sort = this.options.sorting[columnId] === 'asc' ? 'desc' : 'asc';
                    if (!isCtrlPressed && !isShiftPressed) {
                        this.options.sorting = {};
                    } else {
                        delete this.options.sorting[columnId];
                    }
                    this.options.sorting[columnId] = sort;
                } else {
                    if (!isCtrlPressed && !isShiftPressed) {
                        this.options.sorting = {};
                    }
                    this.options.sorting[columnId] = 'asc';
                }
                this.fetchData();
            });
        });
    }

    updateSortingIcons() {
        const sortableHeaders = this.dt.querySelectorAll(".avalynx-datatable-table thead th[data-avalynx-datatable-sortable]");
        sortableHeaders.forEach(header => {
            const columnId = header.getAttribute('data-avalynx-datatable-column-id');
            if (!columnId) return;
            if (this.options.sorting[columnId]) {
                if (this.options.sorting[columnId] === 'asc') {
                    header.classList.add('avalynx-datatable-sorting-asc');
                    header.classList.remove('avalynx-datatable-sorting-desc');
                } else {
                    header.classList.add('avalynx-datatable-sorting-desc');
                    header.classList.remove('avalynx-datatable-sorting-asc');
                }
            } else {
                header.classList.remove('avalynx-datatable-sorting-asc', 'avalynx-datatable-sorting-desc');
            }
        });
    }

    populateShowEntries() {
        const entries = this.dt.querySelector(".avalynx-datatable-bottom .avalynx-datatable-bottom-entries");
        const start = this.result.count.start;
        const end = this.result.count.end;
        const total = this.result.count.total;
        const filtered = this.result.count.filtered;

        if (this.result.count.filtered === this.result.count.all) {
            entries.textContent = this.language.showingEntries(start, end, total);
        } else {
            entries.textContent = this.language.showingFilteredEntries(start, end, filtered, total);
        }
    }

    populatePagination() {
        const paginationUl = this.dt.querySelector(".avalynx-datatable-bottom-pagination ul");
        paginationUl.innerHTML = '';

        const prevDisabled = this.options.currentPage === 1;
        if (this.options.paginationPrevNext) {
            this.addPaginationItem(paginationUl, this.options.currentPage - 1, this.language.previousLabel, prevDisabled);
        }

        let startPage = Math.max(1, this.options.currentPage - this.options.paginationRange);
        let endPage = Math.min(this.options.currentPage + this.options.paginationRange, this.totalPages);

        for (let i = startPage; i <= endPage; i++) {
            this.addPaginationItem(paginationUl, i, i, false);
        }

        const nextDisabled = this.options.currentPage === this.totalPages;
        if (this.options.paginationPrevNext) {
            this.addPaginationItem(paginationUl, this.options.currentPage + 1, this.language.nextLabel, nextDisabled);
        }
    }

    addPaginationItem(paginationUl, pageNumber, text = pageNumber, disabled = false) {
        const li = document.createElement("li");
        li.className = "page-item" + (pageNumber === this.options.currentPage ? " active" : "") + (disabled ? " disabled" : "");
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
        paginationUl.appendChild(li);
    }

    setupOverlayAndLoader() {
        if (this.options.loader === null) {
            const overlay = document.createElement('div');
            overlay.id = `${this.id}-overlay`;
            overlay.style.position = 'absolute';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.display = 'none';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.backgroundColor = 'rgba(var(--bs-body-bg-rgb, 0, 0, 0), 0.7)';
            overlay.style.zIndex = '1000';

            const spinner = document.createElement('div');
            spinner.className = 'spinner-border text-primary';
            spinner.role = 'status';
            spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';

            overlay.appendChild(spinner);
            this.dt.style.position = 'relative';
            this.dt.appendChild(overlay);
        }
    }
}
