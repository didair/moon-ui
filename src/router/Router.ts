import { Signal, signal, computed } from "@preact/signals-core";
import { PageLayoutType, Page } from "./Page";
import { render as renderElements } from "../render";

interface RouterProps {
	pages: Array<any>; // Any for now due to TS2339 error
	defaultLayout: PageLayoutType;
};

export class Router {
	private _pages: Array<Page>;
	private _internalPage: Signal<Page>;
	private _defaultLayout?: PageLayoutType;

	constructor(props: RouterProps) {
		if (props.pages == null || props.pages.length == 0) {
			console.error('Pages is empty!');
		}

		this._internalPage = new Signal(null);
		this._defaultLayout = props.defaultLayout;
		this._pages = props.pages.map((pageInstance: typeof Page) => {
			return new pageInstance();
		});

		window.addEventListener('popstate', () => {
			console.log('popstate');
			this._loadInitialRoute();
		});

		this._loadInitialRoute();
		(window as any).routerContext = this;
	}

	private _getCurrentPath() {
		const pathnameSplit = window.location.pathname.split('/');
		const pathSegs = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : '';
		return pathSegs.toString();
	}

	private _loadInitialRoute() {
		const path = this._getCurrentPath();
		this._loadRoute(path);
	}

	private _onNavigation() {
		const path = this._getCurrentPath();
		this._loadRoute(path);
	}

	private _matchUrlToPage(path: string) {
		const matchedPage = this._pages.find(route => {
			const routePathSplit = route.path.split('/');
			const routePath = routePathSplit.length > 1 ? routePathSplit.slice(1) : '';
			return routePath.toString() === path;
		});

		return matchedPage;
	}

	private _loadRoute(path) {
		const matchedPage = this._matchUrlToPage(path);
		if (!matchedPage) {
			throw new Error('404: Page not found');
		}

		this._internalPage.value = matchedPage;
	}

	private _getPageLayoutInstance() {
		const currentPage = this._internalPage.value;
		if (currentPage.layout != null && typeof currentPage.layout === 'function') {
			return currentPage.layout;
		}

		if (this._defaultLayout != null && typeof this._defaultLayout === 'function') {
			return this._defaultLayout;
		}

		return false;
	}

	navigate(path: string) {
		console.log('navigate', path);
		window.history.pushState({}, '', path);
		this._onNavigation();
	}

	replace(path: string) {
		console.log('replace', path);
		window.history.replaceState({}, '', path);
		this._onNavigation();
	}

	render(parent: HTMLElement = document.body) {
		this._internalPage.subscribe((page) => {
			if (page == null) {
				return null;
			}

			const layout = this._getPageLayoutInstance();
			let elements = [];

			console.log('got layout', layout);

			if (layout) {
				elements = layout(page.render());
			} else {
				elements = page.render();
			}

			if (!Array.isArray(elements) && typeof elements === 'object') {
				// Convert page elements to array if it returns object
				elements = [elements];
			}

			parent.innerHTML = '';
			renderElements(elements, parent);
		});
	}
};
