# AGENTS

This document contains instructions for AI agents and developers working on this project.

## Project

This project is part of the [Avalynx](https://github.com/avalynx) library family. It is a lightweight, vanilla JavaScript library based on Bootstrap >=5.3 without any other framework dependencies.

## Development Environment (Docker)

All development work, especially builds and tests, must be performed within the provided Docker environment.

### Setup

The development environment is managed with `./core.sh`. Create a local `.env.local` from `.env.local.example` (first time only):

```bash
cp .env.local.example .env.local
```

### Start Docker

```bash
./core.sh up
```

### Enter Container

```bash
./core.sh shell
```

## Build & Test

All commands run inside the Docker container via `core.sh`:

### Install Dependencies

```bash
./core.sh npm install
```

### Build Project

```bash
./core.sh npm run build
```

### Run Tests

```bash
./core.sh npm test
```

## Quality Standards

### Test Coverage (Codecov)

*   **IMPORTANT:** All tests must achieve **100%** code coverage.
*   No changes shall be accepted that lower the coverage below 100%.
*   Coverage can be checked with the following command:
    ```bash
    ./core.sh npm test -- --coverage
    ```

### Code Style

*   Maintain existing naming conventions and code structures.
*   Do not add framework dependencies (except Bootstrap >=5.3).
*   Write lightweight, framework-independent vanilla JavaScript code.
*   Follow ESM (ECMAScript Modules) standards where applicable.
*   Use Jest for testing.
*   All JSDoc `@param` blocks must follow the project-wide style:
    *   `@param {object} options - An object containing the following keys:` followed by indented `@param` lines for each option.
    *   One blank `*` line between the `options` and `language` parameter blocks (where applicable).
    *   All defaults documented inline as `(default: value)` — never use backticks around the default value.
    *   Class-level JSDoc description must start with `AvalynxXxx is ...`.