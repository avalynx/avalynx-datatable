/**
 * AvalynxLoader
 *
 * AvalynxLoader is a lightweight JavaScript library designed to provide a loading overlay for DOM elements. Based on Bootstrap >=5.3 without any framework dependencies.
 *
 * @version 1.0.3
 * @license MIT
 * @author https://github.com/avalynx/avalynx-loader/graphs/contributors
 * @website https://github.com/avalynx/
 * @repository https://github.com/avalynx/avalynx-loader.git
 * @bugs https://github.com/avalynx/avalynx-loader/issues
 *
 * @param {string} selector - A custom selector for targeting loader elements within the DOM (default: '.avalynx-loader').
 * @param {object} options - An object containing the following keys:
 * @param {string} options.className - A custom class name for the loader element (default: 'spinner-border text-primary').
 *
 * @param {object} language - An object containing the following keys:
 * @param {string} language.loaderText - A custom text for the loader element. If set to empty string, no text will be displayed. (default: 'Loading...').
 *
 */

class AvalynxLoader {
    constructor(selector, options = {}, language = {}) {
        if (!selector) {
            selector = '.avalynx-loader';
        }
        if (!selector.startsWith('.') && !selector.startsWith('#')) {
            selector = '.' + selector;
        }
        this.elements = document.querySelectorAll(selector);
        if (this.elements.length === 0) {
            console.error("AvalynxLoader: Loader(s) with selector '" + selector + "' not found");
            return;
        }
        if (options === null || typeof options !== 'object') {
            options = {};
        }
        this.options = {
            className: 'spinner-border text-primary',
            ...options
        };
        if (language === null || typeof language !== 'object') {
            language = {};
        }
        this.language = {
            loaderText: 'Loading...',
            ...language
        };
        this.loaderOverlays = new Map();
    }

    set load(shouldLoad) {
        this.elements.forEach(element => {
            if (shouldLoad) {
                this.showLoader(element);
            } else {
                this.hideLoader(element);
            }
        });
    }

    showLoader(element) {
        this.ensureOverlayPresent(element);

        let overlay = this.loaderOverlays.get(element);
        overlay.style.display = 'flex';
    }

    ensureOverlayPresent(element) {
        let overlay = this.loaderOverlays.get(element);
        if (!overlay || !element.contains(overlay)) {
            this.setupOverlayAndLoader(element);
        }
    }

    hideLoader(element) {
        if (this.loaderOverlays.has(element)) {
            let overlay = this.loaderOverlays.get(element);
            overlay.style.display = 'none';
        }
    }

    setupOverlayAndLoader(element) {
        const overlay = document.createElement('div');
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
        spinner.className = this.options.className;
        spinner.setAttribute('role', 'status');
        if (this.language.loaderText !== '') {
            spinner.innerHTML = '<span class="visually-hidden">' + this.language.loaderText + '</span>';
        } else {
            spinner.innerHTML = '';
        }

        overlay.appendChild(spinner);

        element.style.position = 'relative';
        element.appendChild(overlay);

        this.loaderOverlays.set(element, overlay);
    }
}

/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvalynxLoader;
}
