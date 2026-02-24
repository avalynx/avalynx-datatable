# AvalynxDataTable

[![npm version](https://img.shields.io/npm/v/avalynx-datatable)](https://www.npmjs.com/package/avalynx-datatable)
[![npm downloads](https://img.shields.io/npm/dt/avalynx-datatable)](https://www.npmjs.com/package/avalynx-datatable)
[![jsDelivr](https://img.shields.io/jsdelivr/npm/hm/avalynx-datatable)](https://www.jsdelivr.com/package/npm/avalynx-datatable)
[![License](https://img.shields.io/npm/l/avalynx-datatable)](LICENSE)
[![Tests](https://github.com/avalynx/avalynx-datatable/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/avalynx/avalynx-datatable/actions/workflows/tests.yml)
[![codecov](https://codecov.io/gh/avalynx/avalynx-datatable/branch/main/graph/badge.svg)](https://codecov.io/gh/avalynx/avalynx-datatable)
[![GitHub stars](https://img.shields.io/github/stars/avalynx/avalynx-datatable?style=flat&logo=github)](https://github.com/avalynx/avalynx-datatable)

AvalynxDataTable ist eine einfache, leichtgewichtige und anpassbare Datentabellen-Komponente für Webanwendungen. Sie wurde für die Verwendung mit Bootstrap Version 5.3 oder höher entwickelt und benötigt keine Framework-Abhängigkeiten.

## Funktionen

- **Leichtgewichtig und anpassbar**: Einfache Integration in Ihre Webanwendungen ohne schwere Abhängigkeiten.
- **Bootstrap-Integration**: Entwickelt für die nahtlose Integration mit Bootstrap >= 5.3.
- **Datenabruf**: Abruf von Daten von jedem API-Endpunkt.
- **Sortieren und Suchen**: Integrierte Sortier- und Suchfunktionen.
- **Pagination**: Anpassbare Pagination-Optionen, einschließlich Zurück/Weiter-Buttons und Seitenbereich.
- **Responsive**: Vollständig responsives Design für verschiedene Geräte.

## Beispiel

Hier ist ein einfaches Beispiel, wie Sie AvalynxDataTable in Ihrem Projekt verwenden können:

* [Übersicht](https://avalynx-datatable.jbs-newmedia.de/examples/index.html)
* [DataTable](https://avalynx-datatable.jbs-newmedia.de/examples/datatable.html)
* [DataTable mit langsamer Antwort](https://avalynx-datatable.jbs-newmedia.de/examples/datatable-slow-response.html)
* [DataTable mit mehreren Instanzen](https://avalynx-datatable.jbs-newmedia.de/examples/datatable-multiple-instances.html)
* [DataTable mit AvalynxLoader & AvalynxTable Integration](https://avalynx-datatable.jbs-newmedia.de/examples/datatable-loader-table-integration.html)

## Installation

Um AvalynxDataTable in Ihrem Projekt zu verwenden, können Sie es direkt in Ihre HTML-Datei einbinden. Stellen Sie sicher, dass Sie Bootstrap 5.3 oder höher in Ihrem Projekt eingebunden haben, damit AvalynxDataTable korrekt funktioniert.

Zuerst Bootstrap einbinden:

```html
<!-- Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/js/bootstrap.bundle.min.js"></script>
```

Dann AvalynxDataTable einbinden:

```html
<link href="path/to/avalynx-datatable.css" rel="stylesheet">
<script src="path/to/avalynx-datatable.js"></script>
```

Ersetzen Sie `path/to/avalynx-datatable.js` und `path/to/avalynx-datatable.css` durch den tatsächlichen Pfad zu den Dateien in Ihrem Projekt.

## Installation über jsDelivr ([Link](https://cdn.jsdelivr.net/npm/avalynx-datatable/))

AvalynxDataTable ist auch über [jsDelivr](https://www.jsdelivr.com/) verfügbar. Sie können es so in Ihr Projekt einbinden:

```html
<link href="https://cdn.jsdelivr.net/npm/avalynx-datatable@1.0.2/dist/css/avalynx-datatable.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/avalynx-datatable@1.0.2/dist/js/avalynx-datatable.min.js"></script>
```

Stellen Sie sicher, dass Sie auch die JS/CSS-Dateien von Bootstrap in Ihr Projekt einbinden, damit AvalynxDataTable korrekt angezeigt wird.

## Installation über NPM ([Link](https://www.npmjs.com/package/avalynx-datatable))

AvalynxDataTable ist auch als npm-Paket verfügbar. Sie können es mit dem folgenden Befehl zu Ihrem Projekt hinzufügen:

```bash
npm install avalynx-datatable
```

Nach der Installation können Sie AvalynxDataTable wie folgt in Ihre JavaScript-Datei importieren:

```javascript
import { AvalynxDataTable } from 'avalynx-datatable';
import 'avalynx-datatable/dist/css/avalynx-datatable.min.css';
```

Stellen Sie sicher, dass Sie auch die JS/CSS-Dateien von Bootstrap in Ihr Projekt einbinden, damit AvalynxDataTable korrekt angezeigt wird.

## Installation über Symfony AssetMapper

```bash
php bin/console importmap:require avalynx-datatable
```

Nach der Installation können Sie AvalynxDataTable wie folgt in Ihre JavaScript-Datei importieren:

```javascript
import { AvalynxDataTable } from 'avalynx-datatable';
import 'avalynx-datatable/dist/css/avalynx-datatable.min.css';
```

Stellen Sie sicher, dass Sie auch die JS/CSS-Dateien von Bootstrap in Ihr Projekt einbinden, damit AvalynxDataTable korrekt angezeigt wird.

## Installation über Symfony AssetComposer

Weitere Informationen zum Symfony AssetComposer Bundle finden Sie [hier](https://github.com/jbsnewmedia/asset-composer-bundle).

```twig
{% do addAssetComposer('avalynx/avalynx-datatable/dist/css/avalynx-datatable.css') %}
{% do addAssetComposer('avalynx/avalynx-datatable/dist/js/avalynx-datatable.js') %}
```

Stellen Sie sicher, dass Sie auch die JS/CSS-Dateien von Bootstrap in Ihr Projekt einbinden, damit AvalynxDataTable korrekt angezeigt wird.

## Installation über Composer ([Link](https://packagist.org/packages/avalynx/avalynx-datatable))

AvalynxDataTable ist auch als Composer-Paket verfügbar. Sie können es mit dem folgenden Befehl zu Ihrem Projekt hinzufügen:

```bash
composer require avalynx/avalynx-datatable
```

Nach der Installation können Sie AvalynxDataTable wie folgt in Ihre HTML-Datei einbinden:

```html
<link href="vendor/avalynx/avalynx-datatable/dist/css/avalynx-datatable.css" rel="stylesheet">
<script src="vendor/avalynx/avalynx-datatable/dist/js/avalynx-datatable.js"></script>
```

Stellen Sie sicher, dass Sie auch die JS/CSS-Dateien von Bootstrap in Ihr Projekt einbinden, damit AvalynxDataTable korrekt angezeigt wird.

## Verwendung

Um eine Datentabelle zu erstellen, instanziieren Sie einfach ein neues `AvalynxDataTable`-Objekt mit den gewünschten Optionen:

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

## Sprachreferenz

Die standardmäßigen englischen Labels sind:

- `showLabel`: `'Show'`
- `entriesLabel`: `'entries'`
- `searchLabel`: `'Search'`
- `previousLabel`: `'Previous'`
- `nextLabel`: `'Next'`
- `showingEntries`: `(start, end, total) => 'Showing ${start} to ${end} of ${total} entries'`
- `showingFilteredEntries`: `(start, end, filtered, total) => 'Showing ${start} to ${end} of ${filtered} entries (filtered from ${total} total entries)'`

Für Deutsch können Sie Folgendes verwenden:

- `showLabel`: `'Zeige'`
- `entriesLabel`: `'Einträge'`
- `searchLabel`: `'Suche'`
- `previousLabel`: `'Zurück'`
- `nextLabel`: `'Weiter'`
- `showingEntries`: `(start, end, total) => 'Zeige ${start} bis ${end} von ${total} Einträgen'`
- `showingFilteredEntries`: `(start, end, filtered, total) => 'Zeige ${start} bis ${end} von ${filtered} Einträgen (gefiltert von ${total} Einträgen)'`

## JSON-Datenstruktur

AvalynxDataTable erwartet Daten in einem spezifischen JSON-Format, um die Tabelle korrekt zu rendern. Das JSON-Objekt sollte die folgenden Felder enthalten:

```json
{
    "head": {
        "columns": [
            {"name": "Name", "sortable": true, "id": "name"},
            {"name": "ID", "sortable": true, "id": "id", "hidden": true},
            {"name": "Alter", "id": "age"},
            {"name": "Stadt", "sortable": true, "id": "city"},
            {"name": "Optionen", "raw": true, "id": "options", "class": "avalynx-datatable-options"}
        ]
    },
    "data": [
        {
            "data": {
                "id": 1,
                "name": "Tiger Nixon",
                "age": 61,
                "city": "Edinburgh",
                "options": "<a class='btn btn-sm btn-primary'>Bearbeiten</a>"
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
                "options": "<a class='btn btn-sm btn-primary'>Bearbeiten</a>"
            },
            "config": {"test": "test_text"},
            "class": "",
            "data_class": {"options": "table-danger"}
        }
        // Weitere Daten ...
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

- **head.columns**: Definiert die Tabellenspalten und deren Eigenschaften wie `sortable` (ob die Spalte sortiert werden kann) oder `hidden` (ob die Spalte ausgeblendet ist).

    - **name**: Der Anzeigename der Spalte.
    - **sortable**: Ein Boolean, der angibt, ob die Spalte sortierbar ist.
    - **id**: Der interne Identifikator für die Spalte, der bei der Sortierung und Datenbindung verwendet wird.
    - **hidden**: (optional) Gibt an, ob die Spalte standardmäßig ausgeblendet ist.
    - **raw**: (optional) Gibt an, ob der Inhalt der Spalte rohes HTML ist.
    - **class**: (optional) CSS-Klasse für die Spalte, die für das Styling verwendet werden kann.

- **data**: Enthält die tatsächlichen Daten, die in der Tabelle angezeigt werden. Jeder Eintrag (Zeile) enthält Folgendes:
    - **data**: Ein Objekt mit den tatsächlichen Zeilenwerten, wie `id`, `name`, `age`, `city` und ein `options`-Feld, das HTML für Aktionsschaltflächen enthält.
    - **config**: (optional) Zusätzliche Konfiguration, die zur Anpassung des Zeilenverhaltens verwendet werden kann.
    - **class**: (optional) CSS-Klasse, die auf die gesamte Zeile angewendet wird.
    - **data_class**: (optional) CSS-Klassen für bestimmte Spalten in der Zeile.

- **count**: Enthält Metadaten über die Ergebnismenge:
    - **total**: Die Gesamtzahl der Datensätze in der Datenbank.
    - **filtered**: Die Anzahl der Datensätze nach der Filterung (z. B. basierend auf der Sucheingabe).
    - **start**: Der Index des ersten Datensatzes auf der aktuellen Seite.
    - **end**: Der Index des letzten Datensatzes auf der aktuellen Seite.
    - **perpage**: Die Anzahl der Datensätze pro Seite (Pagination-Größe).
    - **page**: Die aktuelle Seitennummer.

- **sorting**: Definiert die aktuelle Sortierkonfiguration, wobei der Schlüssel die Spalten-ID und der Wert die Sortierrichtung (`asc` oder `desc`) ist.

- **search**: Repräsentiert den aktuellen Suchfilter, der auf die Daten angewendet wird. Es enthält:
    - **value**: Die Suchabfrage, die zum Filtern der Tabellendaten verwendet wird.

## Optionen

AvalynxDataTable ermöglicht die folgenden Optionen zur Anpassung:

- `id` (string): Die ID des Elements, an das die Tabelle angehängt werden soll.
- `options` (object): Ein Objekt, das die folgenden Schlüssel enthält:
  - `apiUrl` (string): URL zum Abrufen der Daten (Standard: `null`).
  - `apiMethod` (string): Die HTTP-Methode, die beim Abrufen von Daten von der API verwendet werden soll (Standard: `'POST'`).
  - `apiParams` (object): Zusätzliche Parameter, die mit der API-Anfrage gesendet werden sollen (Standard: `{}`).
  - `sorting` (object): Die anfängliche Sortierkonfiguration für die Tabelle. Das Format ist ein Array von Objekten, die Spalte und Richtung angeben, z. B. `[{"column": "name", "dir": "asc"}]` (Standard: `[]`).
  - `currentPage` (number): Die anfängliche Seitennummer, die angezeigt werden soll (Standard: `1`).
  - `search` (string): Der anfängliche Suchstring zum Filtern der Tabellendaten (Standard: `''`).
  - `searchWait` (number): Die Debounce-Zeit in Millisekunden, die nach dem letzten Tastendruck gewartet wird, bevor die Suche ausgeführt wird (Standard: `800`).
  - `listPerPage` (array): Die Liste der Optionen für das Pro-Seite-Dropdown (Standard: `[10, 25, 50, 100]`).
  - `perPage` (number): Die anfängliche Anzahl der Elemente pro Seite (Standard: `10`).
  - `className` (string): Die CSS-Klassen, die auf die Tabelle angewendet werden sollen (Standard: `'table table-striped table-bordered table-responsive'`).
  - `paginationPrevNext` (boolean): Ob die Vorherige- und Nächste-Buttons in der Pagination angezeigt werden sollen (Standard: `true`).
  - `paginationRange` (number): Die Anzahl der Seiten, die auf jeder Seite der aktuellen Seite in der Pagination angezeigt werden sollen (Standard: `2`).
  - `loader` (object): Eine Instanz von AvalynxLoader, die als Loader für die Tabelle verwendet werden soll (Standard: `null`).  
- `language` (object): Ein Objekt, das die folgenden Schlüssel enthält:
  - `showLabel` (string): Das Label für die Auswahl der Einträge pro Seite (Standard: `'Show'`).
  - `entriesLabel` (string): Das Label neben der Auswahl der Einträge pro Seite, das angibt, was die Zahlen darstellen (Standard: `'entries'`).
  - `searchLabel` (string): Das Label für das Sucheingabefeld (Standard: `'Search'`).
  - `previousLabel` (string): Das Label für den Zurück-Button der Pagination (Standard: `'Previous'`).
  - `nextLabel` (string): Das Label für den Weiter-Button der Pagination (Standard: `'Next'`).
  - `showingEntries` (function): Eine Funktion zur Formatierung des Textes, der den Bereich der sichtbaren Einträge von der Gesamtzahl anzeigt (Standard: `(start, end, total) => 'Showing ${start} to ${end} of ${total} entries'`).
  - `showingFilteredEntries` (function): Eine Funktion zur Formatierung des Textes, der den Bereich der sichtbaren Einträge von der Gesamtzahl anzeigt, wenn gefiltert wurde (Standard: `(start, end, filtered, total) => 'Showing ${start} to ${end} of ${filtered} entries (filtered from ${total} total entries)'`).

## Geplante Funktionen

Obwohl AvalynxDataTable bereits ein leistungsstarkes Werkzeug zur Anzeige und Interaktion mit Daten in Webanwendungen ist, arbeiten wir ständig daran, seine Fähigkeiten zu verbessern und zu erweitern. Hier sind einige der Funktionen, die wir für die Zukunft planen:

- **Responsive Layout-Transformation**: Wir planen, die Möglichkeit hinzuzufügen, dass sich Tabellenzeilen auf kleineren Geräten in ein Listenlayout verwandeln. Diese Funktion wird die Benutzerfreundlichkeit von AvalynxDataTable auf mobilen Geräten verbessern, indem sie eine zugänglichere und benutzerfreundlichere Oberfläche zur Anzeige von Daten bietet.

Bleiben Sie dran für Updates und zögern Sie nicht, Ideen oder Vorschläge über unser [GitHub-Repository](https://github.com/avalynx/avalynx-datatable) einzureichen.

## Beitragen

Beiträge sind willkommen! Wenn Sie einen Beitrag leisten möchten, forken Sie bitte das Repository und senden Sie einen Pull-Request mit Ihren Änderungen oder Verbesserungen. Wir suchen nach Beiträgen in den folgenden Bereichen:

- Fehlerbehebungen
- Funktionserweiterungen
- Verbesserungen der Dokumentation

Bevor Sie Ihren Pull-Request absenden, stellen Sie bitte sicher, dass Ihre Änderungen gut dokumentiert sind und dem bestehenden Codestil des Projekts entsprechen.

## Lizenz

AvalynxDataTable ist Open-Source-Software, die unter der [MIT-Lizenz](LICENSE) lizenziert ist.

## Kontakt

Wenn Sie Fragen, Funktionswünsche oder Probleme haben, eröffnen Sie bitte ein Issue in unserem [GitHub-Repository](https://github.com/avalynx/avalynx-datatable/issues) oder senden Sie einen Pull-Request.

Vielen Dank, dass Sie AvalynxDataTable für Ihr Projekt in Betracht ziehen!
