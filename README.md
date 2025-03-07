# AvalynxDataTable

AvalynxDataTable is a simple, lightweight, and customizable data table component for web applications. It is designed to be used with Bootstrap version 5.3 or higher and does not require any framework dependencies.

## Features

- **Lightweight and Customizable**: Easily integrate with your web applications without heavy dependencies.
- **Bootstrap Integration**: Designed for seamless integration with Bootstrap >= 5.3.
- **Data Fetching**: Fetch data from any API endpoint.
- **Sorting and Searching**: Built-in sorting and searching functionalities.
- **Pagination**: Customizable pagination options including previous/next buttons and page range.
- **Responsive**: Fully responsive design to work on various devices.

## Example

Here's a simple example of how to use AvalynxDataTable in your project:

* [Overview](https://avalynx-datatable.jbs-newmedia.de/examples/index.html)
* [DataTable](https://avalynx-datatable.jbs-newmedia.de/examples/datatable.html)
* [DataTable with slow response](https://avalynx-datatable.jbs-newmedia.de/examples/datatable-slow-response.html)
* [DataTable multiple instances](https://avalynx-datatable.jbs-newmedia.de/examples/datatable-multiple-instances.html)

## Installation

To use AvalynxDataTable in your project, you can directly include it in your HTML file. Ensure you have Bootstrap 5.3 or higher included in your project for AvalynxDataTable to work correctly.

First, include Bootstrap:

```html
<!-- Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/js/bootstrap.bundle.min.js"></script>
```

Then, include AvalynxDataTable:

```html
<link href="path/to/avalynx-datatable.css" rel="stylesheet">
<script src="path/to/avalynx-datatable.js"></script>
```

Replace `path/to/avalynx-datatable.js` and `path/to/avalynx-datatable.css` with the actual path to the files in your project.

## Installation via jsDelivr ([Link](https://cdn.jsdelivr.net/npm/avalynx-datatable/))

AvalynxDataTable is also available via [jsDelivr](https://www.jsdelivr.com/). You can include it in your project like this:

```html
<link href="https://cdn.jsdelivr.net/npm/avalynx-datatable@0.0.4/dist/css/avalynx-datatable.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/avalynx-datatable@0.0.4/dist/js/avalynx-datatable.min.js"></script>
```

Make sure to also include Bootstrap's JS/CSS in your project to ensure AvalynxDataTable displays correctly.

## Installation via NPM ([Link](https://www.npmjs.com/package/avalynx-datatable))

AvalynxDataTable is also available as a npm package. You can add it to your project with the following command:

```bash
npm install avalynx-datatable
```

After installing, you can import AvalynxDataTable into your JavaScript file like this:

```javascript
import { AvalynxDataTable } from 'avalynx-datatable';
import 'avalynx-datatable/dist/css/avalynx-datatable.min.css';
```

Make sure to also include Bootstrap's JS/CSS in your project to ensure AvalynxDataTable displays correctly.

## Installation via Symfony AssetMapper

```bash
php bin/console importmap:require avalynx-datatable
```

After installing, you can import AvalynxDataTable into your JavaScript file like this:

```javascript
import { AvalynxDataTable } from 'avalynx-datatable';
import 'avalynx-datatable/dist/css/avalynx-datatable.min.css';
```

Make sure to also include Bootstrap's JS/CSS in your project to ensure AvalynxDataTable displays correctly.

## Installation via Composer ([Link](https://packagist.org/packages/avalynx/avalynx-datatable))

AvalynxDataTable is also available as a Composer package. You can add it to your project with the following command:

```bash
composer require avalynx/avalynx-datatable
```

After installing, you can import AvalynxDataTable into your HTML file like this:

```html
<link href="vendor/avalynx/avalynx-datatable/dist/css/avalynx-datatable.css" rel="stylesheet">
<script src="vendor/avalynx/avalynx-datatable/dist/js/avalynx-datatable.js"></script>
``` 

Make sure to also include Bootstrap's JS/CSS in your project to ensure AvalynxDataTable displays correctly.

## Usage

To create a datatable, simply instantiate a new `AvalynxDataTable` object with the desired options:

```html
<div id="avalynx-datatable"></div>
```

```javascript
new AvalynxDataTable("avalynx-datatable", {
  apiUrl: "result.php",
  perPage: 10,
  search: "",
  sorting: {
    "name": "asc",
    "age": "desc"
  }
}, {
  showLabel: "Zeige",
  entriesLabel: "Einträge",
  searchLabel: "Suche",
  previousLabel: "Zurück",
  nextLabel: "Weiter",
  showingEntries: (start, end, total) => `Zeige ${start} bis ${end} von ${total} Einträgen`,
  showingFilteredEntries: (start, end, filtered, total) => `Zeige ${start} bis ${end} von ${filtered} Einträgen (gefiltert von ${total} Einträgen)`
});
```

## JSON Data Structure

AvalynxDataTable expects data in a specific JSON format to render the table correctly. The JSON object should contain the following fields:

```json
{
    "head": {
        "columns": [
            {"name": "Name", "sortable": true, "id": "name"},
            {"name": "ID", "sortable": true, "id": "id", "hidden": true},
            {"name": "Age", "id": "age"},
            {"name": "City", "sortable": true, "id": "city"},
            {"name": "Options", "raw": true, "id": "options", "class": "avalynx-datatable-options"}
        ]
    },
    "data": [
        {
            "data": {
                "id": 1,
                "name": "Tiger Nixon",
                "age": 61,
                "city": "Edinburgh",
                "options": "<a class='btn btn-sm btn-primary'>Edit</a>"
            },
            "config": {"test": "test_text"},
            "class": "table-danger"
        },
        {
            "data": {
                "id": 2,
                "name": "Garrett Winters",
                "age": 63,
                "city": "Tokyo",
                "options": "<a class='btn btn-sm btn-primary'>Edit</a>"
            },
            "config": {"test": "test_text"},
            "class": "",
            "data_class": {"options": "table-danger"}
        }
        // Additional data ...
    ],
    "count": {
        "total": 57,
        "filtered": 57,
        "start": 1,
        "end": 10,
        "perpage": 10,
        "page": 1
    },
    "sorting": {
        "name": "asc",
        "age": "desc"
    },
    "search": {
        "value": ""
    }
}

```

- **head.columns**: Defines the table columns and their properties like `sortable` (whether the column can be sorted) or `hidden` (whether the column is hidden).

    - **name**: The display name of the column.
    - **sortable**: A boolean that specifies whether the column is sortable.
    - **id**: The internal identifier for the column used in sorting and data binding.
    - **hidden**: (optional) Indicates if the column is hidden by default.
    - **raw**: (optional) Specifies that the content of the column is raw HTML.
    - **class**: (optional) CSS class for the column, which can be used for styling.

- **data**: Contains the actual data that is displayed in the table. Each entry (row) contains the following:
    - **data**: An object with the actual row values, such as `id`, `name`, `age`, `city`, and an `options` field that contains HTML for action buttons.
    - **config**: (optional) Additional configuration that can be used to customize the row behavior.
    - **class**: (optional) CSS class applied to the entire row.
    - **data_class**: (optional) CSS classes for specific columns in the row.

- **count**: Contains metadata about the result set:
    - **total**: The total number of records in the database.
    - **filtered**: The number of records after filtering (e.g., based on search input).
    - **start**: The index of the first record on the current page.
    - **end**: The index of the last record on the current page.
    - **perpage**: The number of records per page (pagination size).
    - **page**: The current page number.

- **sorting**: Defines the current sorting configuration, where the key is the column ID and the value is the sorting direction (`asc` or `desc`).

- **search**: Represents the current search filter applied to the data. It contains:
    - **value**: The search query string used to filter the table data.

## Options

AvalynxDataTable allows the following options for customization:

- `id` (string): The ID of the element to attach the table to.
- `options` (object): An object containing the following keys:
  - `apiUrl` (string): URL to fetch the data from (default: `null`).
  - `apiMethod` (string): The HTTP method to use when fetching data from the API (default: `'POST'`).
  - `apiParams` (object): Additional parameters to send with the API request (default: `{}`).
  - `sorting` (object): The initial sorting configuration for the table. Format is an array of objects specifying column and direction, e.g., `[{"column": "name", "dir": "asc"}]` (default: `[]`).
  - `currentPage` (number): The initial page number to display (default: `1`).
  - `search` (string): The initial search string to filter the table data (default: `''`).
  - `searchWait` (number): The debounce time in milliseconds for search input to wait after the last keystroke before performing the search (default: `800`).
  - `listPerPage` (array): The list of options for the per-page dropdown (default: `[10, 25, 50, 100]`).
  - `perPage` (number): The initial number of items per page (default: `10`).
  - `className` (string): The CSS classes to apply to the table (default: `'table table-striped table-bordered table-responsive'`).
  - `paginationPrevNext` (boolean): Whether to show the previous and next buttons in the pagination (default: `true`).
  - `paginationRange` (number): The number of pages to show on either side of the current page in the pagination (default: `2`).
  - `loader` (object): An instance of AvalynxLoader to use as the loader for the table (default: `null`).  
- `language` (object): An object containing the following keys:
  - `showLabel` (string): The label for the per-page select (default: `'Show'`)
  - `entriesLabel` (string): The label next to the per-page select indicating what the numbers represent (default: `'entries'`)
  - `searchLabel` (string): The label for the search input (default: `'Search'`).
  - `previousLabel` (string): The label for the pagination's previous button (default: `'Previous'`).
  - `nextLabel` (string): The label for the pagination's next button (default: `'Next'`).
  - `showingEntries` (function): A function to format the text showing the range of visible entries out of the total (default: `(start, end, total) => 'Showing ${start} to ${end} of ${total} entries'`).
  - `showingFilteredEntries` (function): A function to format the text showing the range of visible entries out of the total when filtered (default: `(start, end, filtered, total) => 'Showing ${start} to ${end} of ${filtered} entries (filtered from ${total} entries)'`).

## Planned features

While AvalynxDataTable is already a powerful tool for displaying and interacting with data in web applications, we are constantly working to improve and expand its capabilities. Here are some of the features we plan to implement in the future:

- **Responsive Layout Transformation**: We plan to add the ability for data table rows to transform into a list layout on smaller devices. This feature will enhance the usability of AvalynxDataTable on mobile devices by providing a more accessible and user-friendly interface for displaying data.


Stay tuned for updates, and feel free to contribute ideas or suggestions via our [GitHub repository](https://github.com/avalynx/avalynx-datatable).

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request with your changes or improvements. We're looking for contributions in the following areas:

- Bug fixes
- Feature enhancements
- Documentation improvements

Before submitting your pull request, please ensure your changes are well-documented and follow the existing coding style of the project.

## License

AvalynxDataTable is open-sourced software licensed under the [MIT license](LICENSE).

## Contact

If you have any questions, feature requests, or issues, please open an issue on our [GitHub repository](https://github.com/avalynx/avalynx-datatable/issues) or submit a pull request.

Thank you for considering AvalynxDataTable for your project!
