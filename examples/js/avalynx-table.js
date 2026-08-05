/**
 * AvalynxTable
 *
 * AvalynxTable is a simple table system for web applications. Based on Bootstrap >=5.3 without any framework dependencies.
 *
 * @version 1.0.4
 * @license MIT
 * @author https://github.com/avalynx/avalynx-table/graphs/contributors
 * @website https://github.com/avalynx/
 * @repository https://github.com/avalynx/avalynx-table.git
 * @bugs https://github.com/avalynx/avalynx-table/issues
 *
 * @param {string} selector - The selector to use for targeting tables within the DOM (default: '.avalynx-table').
 * @param {object} options - An object containing the following keys:
 * @param {Array.<number|string>} options.sortableColumns - List of sortable columns. Supports index, header label or data-avalynx-table-sort-id (default: all columns).
 * @param {Array.<{column:number|string,dir:string}>} options.sorting - Initial sorting order, e.g. [{ column: 'name', dir: 'asc' }] (default: []).
 * @param {boolean} options.stackedSorter - Shows sorting controls in stacked mode (default: true).
 * @param {boolean} options.stackedMultiSortToggle - Shows multi-sort toggle in stacked mode (default: true).
 * @param {object} options.buttonClasses - Class names for stacked control buttons (default: {multiSortInactive: 'btn btn-sm btn-outline-secondary', multiSortActive: 'btn btn-sm btn-secondary', sortButtonInactive: 'btn btn-sm btn-outline-primary', sortButtonActive: 'btn btn-sm btn-primary'}).
 *
 * @param {object} language - An object containing the following keys:
 * @param {string} language.sortByLabel - The label for the sort-by control (default: 'Sort by').
 * @param {string} language.multiSortLabel - The label for the multi-sort control (default: 'Multi-sort').
 * @param {string} language.multiSortOnLabel - The label for the multi-sort on state (default: 'on').
 * @param {string} language.multiSortOffLabel - The label for the multi-sort off state (default: 'off').
 * @param {string} language.columnLabel - The label for the column selection (default: 'Column').
 *
 */

class AvalynxTable {
    constructor(selector, options = {}, language = {}) {
        if (!selector) {
            selector = '.avalynx-table';
        }
        if (!selector.startsWith('.') && !selector.startsWith('#')) {
            selector = '.' + selector;
        }
        this.tables = document.querySelectorAll(selector);
        if (this.tables.length === 0) {
            console.error("AvalynxTable: Table(s) with selector '" + selector + "' not found");
            return;
        }
        if (options === null || typeof options !== 'object') {
            options = {};
        }
        this.options = {
            sortableColumns: [],
            sorting: [],
            stackedSorter: true,
            stackedMultiSortToggle: true,
            buttonClasses: {
                multiSortInactive: 'btn btn-sm btn-outline-secondary',
                multiSortActive: 'btn btn-sm btn-secondary',
                sortButtonInactive: 'btn btn-sm btn-outline-primary',
                sortButtonActive: 'btn btn-sm btn-primary'
            },
            ...options
        };

        const optionLanguage = (this.options.language && typeof this.options.language === 'object')
            ? this.options.language
            : {};

        this.language = {
            sortByLabel: 'Sort by',
            multiSortLabel: 'Multi-sort',
            multiSortOnLabel: 'on',
            multiSortOffLabel: 'off',
            multiSearchLabel: null,
            multiSearchOnLabel: null,
            multiSearchOffLabel: null,
            columnLabel: 'Column',
            ...optionLanguage,
            ...(language && typeof language === 'object' ? language : {})
        };

        if (Object.hasOwn(this.language, 'multiSearchLabel') && this.language.multiSearchLabel !== null) {
            this.language.multiSortLabel = this.language.multiSearchLabel;
        }
        if (Object.hasOwn(this.language, 'multiSearchOnLabel') && this.language.multiSearchOnLabel !== null) {
            this.language.multiSortOnLabel = this.language.multiSearchOnLabel;
        }
        if (Object.hasOwn(this.language, 'multiSearchOffLabel') && this.language.multiSearchOffLabel !== null) {
            this.language.multiSortOffLabel = this.language.multiSearchOffLabel;
        }

        this.options.buttonClasses = {
            multiSortInactive: 'btn btn-sm btn-outline-secondary',
            multiSortActive: 'btn btn-sm btn-secondary',
            multiSearchInactive: null,
            multiSearchActive: null,
            sortButtonInactive: 'btn btn-sm btn-outline-primary',
            sortButtonActive: 'btn btn-sm btn-primary',
            ...(this.options.buttonClasses && typeof this.options.buttonClasses === 'object'
                ? this.options.buttonClasses
                : {})
        };
        if (Object.hasOwn(this.options.buttonClasses, 'multiSearchInactive') &&
            this.options.buttonClasses.multiSearchInactive !== null) {
            this.options.buttonClasses.multiSortInactive = this.options.buttonClasses.multiSearchInactive;
        }
        if (Object.hasOwn(this.options.buttonClasses, 'multiSearchActive') &&
            this.options.buttonClasses.multiSearchActive !== null) {
            this.options.buttonClasses.multiSortActive = this.options.buttonClasses.multiSearchActive;
        }

        this.options.buttonClasses.multiSortInactive = this.appendRequiredClasses(
            this.options.buttonClasses.multiSortInactive,
            'avalynx-table-sort-multi-toggle'
        );
        this.options.buttonClasses.multiSortActive = this.appendRequiredClasses(
            this.options.buttonClasses.multiSortActive,
            'avalynx-table-sort-multi-toggle active'
        );
        this.options.buttonClasses.sortButtonInactive = this.appendRequiredClasses(
            this.options.buttonClasses.sortButtonInactive,
            'avalynx-table-sort-button'
        );
        this.options.buttonClasses.sortButtonActive = this.appendRequiredClasses(
            this.options.buttonClasses.sortButtonActive,
            'avalynx-table-sort-button active'
        );
        this.tableStates = new WeakMap();

        this._boundWindowResize = this.handleWindowResize.bind(this);
        if (this.options.stackedSorter) {
            window.addEventListener('resize', this._boundWindowResize);
        }

        this.tables.forEach(table => this.init(table));
    }

    appendRequiredClasses(value, required) {
        const allClasses = `${value || ''} ${required}`.trim().split(/\s+/).filter(Boolean);
        return [...new Set(allClasses)].join(' ');
    }

    init(table) {
        this.enhanceTable(table);
        this.setupSorting(table);
    }

    enhanceTable(table) {
        const headers = table.querySelectorAll('thead th');
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index]) {
                    cell.setAttribute('avalynx-td-title', headers[index].textContent);
                }
            });
        });
    }

    setupSorting(table) {
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        if (!thead || !tbody) {
            return;
        }

        const headers = Array.from(thead.querySelectorAll('th'));
        if (headers.length === 0) {
            return;
        }

        const isSortableDefined = Array.isArray(this.options.sortableColumns) && this.options.sortableColumns.length > 0;
        const isSortingDefined = Array.isArray(this.options.sorting) && this.options.sorting.length > 0;

        if (!isSortableDefined && !isSortingDefined) {
            return;
        }

        const sortableIndices = this.getSortableIndices(headers);
        if (sortableIndices.length === 0) {
            return;
        }

        const sorting = this.normalizeDefaultSorting(headers, sortableIndices);

        const state = {
            headers,
            sortableIndices,
            sorting,
            initialSorting: sorting.map((sort) => ({ ...sort })),
            originalRows: Array.from(tbody.querySelectorAll('tr')),
            stackedControls: null,
            stackedMultiMode: sorting.length > 1,
            sortHandler: null
        };

        headers.forEach((header, index) => {
            if (!sortableIndices.includes(index)) {
                return;
            }

            header.classList.add('avalynx-table-sorting');
            header.dataset.avalynxSortIndex = String(index);
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            header.setAttribute('aria-label', `${this.language.sortByLabel} ${header.textContent.trim()}`);
        });

        state.sortHandler = (event) => {
            const header = event.target.closest('th.avalynx-table-sorting');
            if (!header || !thead.contains(header)) {
                return;
            }

            const column = parseInt(header.dataset.avalynxSortIndex, 10);
            if (Number.isNaN(column)) {
                return;
            }

            const isMultiSort = event.ctrlKey || event.shiftKey;
            this.toggleSorting(table, state, column, isMultiSort);
        };

        thead.addEventListener('click', state.sortHandler);
        thead.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }

            const header = event.target.closest('th.avalynx-table-sorting');
            if (!header || !thead.contains(header)) {
                return;
            }

            event.preventDefault();

            const column = parseInt(header.dataset.avalynxSortIndex, 10);
            if (Number.isNaN(column)) {
                return;
            }

            const isMultiSort = event.ctrlKey || event.shiftKey;
            this.toggleSorting(table, state, column, isMultiSort);
        });

        if (this.options.stackedSorter) {
            state.stackedControls = this.createStackedSortControls(table, state);
            this.updateStackedSortControls(table, state);
            this.updateStackedSortControlsVisibility(table, state);
        }

        this.tableStates.set(table, state);
        this.applySorting(table, state);
        this.updateSortUI(table, state);
    }

    getSortableIndices(headers) {
        if (!Array.isArray(this.options.sortableColumns) || this.options.sortableColumns.length === 0) {
            return headers
                .map((_, index) => index)
                .filter(index => this.isSortableHeader(headers[index]));
        }

        const byId = new Map();
        const byName = new Map();

        headers.forEach((header, index) => {
            const id = (header.dataset.avalynxTableSortId || header.dataset.avalynxSortId || '').trim();
            const name = (header.textContent || '').trim().toLowerCase();

            if (id) {
                byId.set(id, index);
            }
            if (name) {
                byName.set(name, index);
            }
        });

        const indices = this.options.sortableColumns
            .map((column) => this.resolveColumnIndex(column, headers, byId, byName))
            .filter(index => index !== -1)
            .filter(index => this.isSortableHeader(headers[index]));

        return [...new Set(indices)].sort((a, b) => a - b);
    }

    isSortableHeader(header) {
        if (!header || header.dataset.avalynxSortable === 'false') {
            return false;
        }

        return (header.textContent || '').trim().length > 0;
    }

    resolveColumnIndex(column, headers, byId, byName) {
        if (typeof column === 'number' && Number.isInteger(column) && headers[column]) {
            return column;
        }

        if (typeof column === 'string') {
            const raw = column.trim();
            if (!raw) {
                return -1;
            }

            if (byId.has(raw)) {
                return byId.get(raw);
            }

            const asNumber = Number.parseInt(raw, 10);
            if (!Number.isNaN(asNumber) && headers[asNumber]) {
                return asNumber;
            }

            const byNameIndex = byName.get(raw.toLowerCase());
            if (typeof byNameIndex === 'number') {
                return byNameIndex;
            }
        }

        return -1;
    }

    normalizeDefaultSorting(headers, sortableIndices) {
        if (!Array.isArray(this.options.sorting)) {
            return [];
        }

        const byId = new Map();
        const byName = new Map();

        headers.forEach((header, index) => {
            const id = (header.dataset.avalynxTableSortId || header.dataset.avalynxSortId || '').trim();
            const name = (header.textContent || '').trim().toLowerCase();

            if (id) {
                byId.set(id, index);
            }
            if (name) {
                byName.set(name, index);
            }
        });

        return this.options.sorting
            .map((sortEntry) => {
                if (!sortEntry || typeof sortEntry !== 'object') {
                    return null;
                }

                const column = this.resolveColumnIndex(sortEntry.column, headers, byId, byName);
                if (!sortableIndices.includes(column)) {
                    return null;
                }

                const dir = sortEntry.dir === 'desc' ? 'desc' : 'asc';
                return { column, dir };
            })
            .filter(Boolean)
            .filter((entry, index, array) => index === array.findIndex(item => item.column === entry.column));
    }

    toggleSorting(table, state, column, isMultiSort = false) {
        const existingIndex = state.sorting.findIndex(item => item.column === column);
        const existing = existingIndex !== -1 ? state.sorting[existingIndex] : null;
        let nextDir = null;

        if (!existing) {
            nextDir = 'asc';
        } else if (existing.dir === 'asc') {
            nextDir = 'desc';
        }

        if (!isMultiSort) {
            state.sorting = nextDir ? [{ column, dir: nextDir }] : [];
        } else {
            if (!existing) {
                state.sorting.unshift({ column, dir: 'asc' });
            } else if (nextDir) {
                state.sorting[existingIndex] = { column, dir: nextDir };
            } else {
                state.sorting.splice(existingIndex, 1);
            }
        }

        if (state.sorting.length === 0 && state.initialSorting.length > 0) {
            state.sorting = state.initialSorting.map((sort) => ({ ...sort }));
            state.stackedMultiMode = state.sorting.length > 1;
        }

        this.applySorting(table, state);
        this.updateSortUI(table, state);
    }

    applySorting(table, state) {
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            return;
        }

        const rowsWithIndex = state.originalRows.map((row, index) => ({ row, index }));
        const sorting = state.sorting;

        if (sorting.length > 0) {
            rowsWithIndex.sort((a, b) => {
                for (const sort of sorting) {
                    const compare = this.compareRows(a.row, b.row, sort.column, sort.dir);
                    if (compare !== 0) {
                        return compare;
                    }
                }

                return a.index - b.index;
            });
        }

        const fragment = document.createDocumentFragment();
        rowsWithIndex.forEach(({ row }) => fragment.appendChild(row));
        tbody.innerHTML = '';
        tbody.appendChild(fragment);
    }

    compareRows(rowA, rowB, column, dir) {
        const cellA = rowA.children[column];
        const cellB = rowB.children[column];

        const valueA = this.getCellSortValue(cellA);
        const valueB = this.getCellSortValue(cellB);

        let result;
        if (valueA.numeric && valueB.numeric) {
            result = valueA.number - valueB.number;
        } else {
            result = valueA.text.localeCompare(valueB.text, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        }

        return dir === 'desc' ? result * -1 : result;
    }

    getCellSortValue(cell) {
        if (!cell) {
            return {
                text: '',
                numeric: false,
                number: 0
            };
        }

        const raw = (cell.dataset.avalynxTableSortValue ||
            cell.dataset.avalynxSortValue ||
            cell.textContent || '').trim();
        const normalized = raw.replace(/\s+/g, '');
        const numericCandidate = normalized.replace(',', '.');
        const number = Number.parseFloat(numericCandidate);
        const numeric = Number.isFinite(number) && /^[-+]?\d+(?:[.,]\d+)?$/.test(numericCandidate);

        return {
            text: raw,
            numeric,
            number: numeric ? number : 0
        };
    }

    updateSortUI(table, state) {
        state.headers.forEach((header, index) => {
            header.classList.remove('avalynx-table-sorting-asc', 'avalynx-table-sorting-desc');
            header.removeAttribute('data-avalynx-sort-order');

            const sortIndex = state.sorting.findIndex(item => item.column === index);
            if (sortIndex === -1) {
                return;
            }

            const dir = state.sorting[sortIndex].dir;
            header.classList.add(dir === 'asc' ? 'avalynx-table-sorting-asc' : 'avalynx-table-sorting-desc');
            header.dataset.avalynxSortOrder = String(sortIndex + 1);
        });

        this.updateStackedSortControls(table, state);
    }

    createStackedSortControls(table, state) {
        const controls = document.createElement('div');
        controls.className = 'avalynx-table-sort-controls';

        if (this.options.stackedMultiSortToggle) {
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = state.stackedMultiMode
                ? this.options.buttonClasses.multiSortActive
                : this.options.buttonClasses.multiSortInactive;
            toggle.textContent = this.getMultiSortToggleText(state.stackedMultiMode);
            toggle.addEventListener('click', () => {
                state.stackedMultiMode = !state.stackedMultiMode;
                toggle.textContent = this.getMultiSortToggleText(state.stackedMultiMode);
                toggle.className = state.stackedMultiMode
                    ? this.options.buttonClasses.multiSortActive
                    : this.options.buttonClasses.multiSortInactive;
            });
            controls.appendChild(toggle);
        }

        const buttons = document.createElement('div');
        buttons.className = 'avalynx-table-sort-buttons';

        state.sortableIndices.forEach((columnIndex) => {
            const header = state.headers[columnIndex];
            const button = document.createElement('button');
            button.type = 'button';
            button.className = this.options.buttonClasses.sortButtonInactive;
            button.dataset.avalynxSortButton = String(columnIndex);
            button.textContent = header.textContent.trim();

            button.addEventListener('click', (event) => {
                const isMultiSort = event.ctrlKey || event.shiftKey || state.stackedMultiMode;
                this.toggleSorting(table, state, columnIndex, isMultiSort);
            });

            buttons.appendChild(button);
        });

        controls.appendChild(buttons);
        table.parentNode.insertBefore(controls, table);

        return controls;
    }

    getMultiSortToggleText(isEnabled) {
        const modeLabel = isEnabled
            ? this.language.multiSortOnLabel
            : this.language.multiSortOffLabel;

        return `${this.language.multiSortLabel}: ${modeLabel}`;
    }

    updateStackedSortControls(table, state) {
        if (!state.stackedControls) {
            return;
        }

        const buttonsContainer = state.stackedControls.querySelector('.avalynx-table-sort-buttons');
        if (!buttonsContainer) {
            return;
        }

        const sortButtons = buttonsContainer.querySelectorAll('[data-avalynx-sort-button]');
        const buttonByColumn = new Map();
        sortButtons.forEach((button) => {
            const column = parseInt(button.dataset.avalynxSortButton, 10);
            if (Number.isNaN(column)) {
                return;
            }

            buttonByColumn.set(column, button);

            button.className = this.options.buttonClasses.sortButtonInactive;
            button.classList.remove('avalynx-table-sorting-asc', 'avalynx-table-sorting-desc');
            button.removeAttribute('data-avalynx-sort-order');

            const sortIndex = state.sorting.findIndex(item => item.column === column);
            if (sortIndex === -1) {
                return;
            }

            const dir = state.sorting[sortIndex].dir;
            button.className = this.options.buttonClasses.sortButtonActive;
            button.classList.add(dir === 'asc' ? 'avalynx-table-sorting-asc' : 'avalynx-table-sorting-desc');
            button.dataset.avalynxSortOrder = String(sortIndex + 1);
        });

        const sortedColumns = state.sorting.map(sort => sort.column);
        const remainingColumns = state.sortableIndices.filter(column => !sortedColumns.includes(column));
        const visualOrder = [...sortedColumns, ...remainingColumns];

        visualOrder.forEach((column) => {
            const button = buttonByColumn.get(column);
            if (button) {
                buttonsContainer.appendChild(button);
            }
        });
    }

    isStacked(table) {
        const hasStackClass = table.classList.contains('avalynx-table') ||
            table.classList.contains('avalynx-table-md') ||
            table.classList.contains('avalynx-table-lg') ||
            table.classList.contains('avalynx-table-xl') ||
            table.classList.contains('avalynx-table-xxl');

        if (!hasStackClass || typeof window.getComputedStyle !== 'function') {
            return false;
        }

        const thead = table.querySelector('thead');
        if (!thead) {
            return false;
        }

        return window.getComputedStyle(thead).display === 'block';
    }

    updateStackedSortControlsVisibility(table, state) {
        if (!state.stackedControls) {
            return;
        }

        state.stackedControls.style.display = this.isStacked(table) ? 'flex' : 'none';
    }

    handleWindowResize() {
        this.tables.forEach((table) => {
            const state = this.tableStates.get(table);
            if (!state) {
                return;
            }

            this.updateStackedSortControlsVisibility(table, state);
        });
    }
}

/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvalynxTable;
}
