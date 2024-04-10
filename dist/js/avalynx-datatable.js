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
 * @param {string} id - The id of the element to attach the table to
 * @param {object} options - The options for the table
 * @param {string} options.apiUrl - The URL to fetch the data from
 * @param {object} options.sorting - The initial sorting of the table
 * @param {string} options.search - The initial search string
 * @param {number} options.searchWait - The time to wait after the last key stroke before searching
 * @param {array} options.listPerPage - The list of options for the per page select
 * @param {number} options.perPage - The initial per page value
 * @param {string} options.cssTable - The CSS classes to apply to the table
 * @param {boolean} options.paginationPrevNext - Whether to show the previous and next buttons in the pagination
 * @param {number} options.paginationRange - The number of pages to show on either side of the current page in the pagination
 * @param {object} language - The language settings for the table
 * @param {string} language.showLabel - The label for the per page select
 * @param {string} language.entriesLabel - The label for the per page select
 * @param {string} language.searchLabel - The label for the search input
 * @param {string} language.previousLabel - The label for the previous button in the pagination
 * @param {string} language.nextLabel - The label for the next button in the pagination
 * @param {function} language.showingEntries - The function to format the entries label
 * @param {function} language.showingFilteredEntries - The function to format the entries label when filtered
 */

class AvalynxDataTable {
    constructor(id, options = {}, language = {}) {
        this.dt = document.getElementById(id);
        if (this.dt === null) {
            console.error("AvalynxDataTable: Element with id '" + id + "' not found");
            return;
        }
        this.id = id;
        this.currentPage = 1;
        this.apiUrl = options.apiUrl || '';
        this.sorting = options.sorting || [];
        this.search = options.search || '';
        this.searchWait = options.searchWait || 800;
        this.listPerPage = options.listPerPage || [10, 25, 50, 100];
        this.perPage = options.perPage || 10;
        this.cssTable = options.cssTable || 'table table-striped table-bordered table-responsive';
        this.paginationPrevNext = options.paginationPrevNext || true;
        this.paginationRange = options.paginationRange || 2;
        if (!this.listPerPage.includes(options.perPage)) {
            this.perPage = 10;
        }
        this.searchIsNew = false;

        this.defaultLanguage = {
            showLabel: "Show",
            entriesLabel: "entries",
            searchLabel: "Search",
            previousLabel: "Previous",
            nextLabel: "Next",
            showingEntries: (start, end, total) => `Showing ${start} to ${end} of ${total} entries`,
            showingFilteredEntries: (start, end, filtered, total) => `Showing ${start} to ${end} of ${filtered} entries (filtered from ${total} total entries)`
        };

        this.language = {...this.defaultLanguage, ...language};

        this.init();
        this.fetchData();
    }

    init() {
        this.ensureTemplatesExist();

        const template_avalynx_datatable_top = document.getElementById("avalynx-datatable-top").content.cloneNode(true);
        const template_avalynx_datatable_table = document.getElementById("avalynx-datatable-table").content.cloneNode(true);
        const template_avalynx_datatable_bottom = document.getElementById("avalynx-datatable-bottom").content.cloneNode(true);

        template_avalynx_datatable_table.querySelector("table").className = this.cssTable + ' avalynx-datatable-table';

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
        const overlay = document.getElementById(`${this.id}-overlay`);
        overlay.style.display = 'flex';

        try {
            const postData = {
                "search": this.search,
                "sorting": this.sorting,
                "page": this.currentPage,
                "perpage": this.perPage,
                "searchisnew": (this.searchIsNew === true) ? 1 : 0,
            };
            postData.sorting = JSON.stringify(postData.sorting);
            const formBody = Object.keys(postData).map(key => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]);
            }).join('&');
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody
            });
            const data = await response.json();
            if (data.error) {
                alert(data.error);
                console.error('Error:', data.error);
                return;
            }
            this.result = data;
            this.searchIsNew = false;
            this.currentPage = this.result.count.page;
            if (this.perPage !== this.result.count.perpage) {
                this.perPage = this.result.count.perpage;
                this.populatePerPageOptions();
            }
            this.totalPages = Math.ceil(this.result.count.filtered / this.result.count.perpage);
            this.populateTable();
            if (this.sorting !== this.result.sorting) {
                this.sorting = this.result.sorting;
                this.updateSortingIcons();
            }
        } catch (error) {
            alert(error);
            console.error('Error:', error);
        } finally {
            overlay.style.display = 'none';
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
            this.perPage = parseInt(event.target.value);
            this.fetchData(this.currentPage);
        });
    }

    populatePerPageOptions() {
        const select = this.dt.querySelector(".avalynx-datatable-top .avalynx-datatable-top-entries .form-select");
        select.innerHTML = '';
        this.listPerPage.forEach((num) => {
            const option = document.createElement("option");
            option.value = num;
            option.textContent = num;
            if (num === this.perPage) {
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
                if (event.target.value !== this.search) {
                    this.searchIsNew = true;
                }
                this.search = event.target.value;
                this.fetchData(this.currentPage);
            }, this.searchWait);
        });
    }

    populateSearchInput() {
        const searchInput = this.dt.querySelector(".avalynx-datatable-top .avalynx-datatable-top-search .form-control");
        searchInput.value = this.search;
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
                if (this.sorting[columnId]) {
                    let sort = this.sorting[columnId] === 'asc' ? 'desc' : 'asc';
                    if (!isCtrlPressed && !isShiftPressed) {
                        this.sorting = {};
                    } else {
                        delete this.sorting[columnId];
                    }
                    this.sorting[columnId] = sort;
                } else {
                    if (!isCtrlPressed && !isShiftPressed) {
                        this.sorting = {};
                    }
                    this.sorting[columnId] = 'asc';
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
            if (this.sorting[columnId]) {
                if (this.sorting[columnId] === 'asc') {
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

        const prevDisabled = this.currentPage === 1;
        if (this.paginationPrevNext) {
            this.addPaginationItem(paginationUl, this.currentPage - 1, this.language.previousLabel, prevDisabled);
        }

        let startPage = Math.max(1, this.currentPage - this.paginationRange);
        let endPage = Math.min(this.currentPage + this.paginationRange, this.totalPages);

        for (let i = startPage; i <= endPage; i++) {
            this.addPaginationItem(paginationUl, i, i, false);
        }

        const nextDisabled = this.currentPage === this.totalPages;
        if (this.paginationPrevNext) {
            this.addPaginationItem(paginationUl, this.currentPage + 1, this.language.nextLabel, nextDisabled);
        }
    }

    addPaginationItem(paginationUl, pageNumber, text = pageNumber, disabled = false) {
        const li = document.createElement("li");
        li.className = "page-item" + (pageNumber === this.currentPage ? " active" : "") + (disabled ? " disabled" : "");
        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = text;
        if (!disabled) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentPage = pageNumber;
                this.fetchData();
            });
        }
        li.appendChild(a);
        paginationUl.appendChild(li);
    }

    setupOverlayAndLoader() {
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
