import { Signal, signal, computed } from "@preact/signals-core";
import { IPage, Page } from "./Page";
import { render as renderElements } from "../render";

interface RouterProps {
	pages: Array<IPage>;
};

export class Router {
	private _pages: Array<IPage>;
	private _internalRoute: Signal;

	constructor(props: RouterProps) {
		if (props.pages == null || props.pages.length == 0) {
			console.error('Pages is empty!');
		}

		this._internalRoute = new Signal(null);
		this._pages = props.pages.map((pageInstance) => {
			console.log('pageInstance', pageInstance);
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

	private _matchUrlToRoute(path: string) {
		const matchedRoute = this._pages.find(route => {
			const routePathSplit = route.path.split('/');
			const routePath = routePathSplit.length > 1 ? routePathSplit.slice(1) : '';
			return routePath.toString() === path;
		});

		return matchedRoute;
	}

	private _loadRoute(path) {
		const matchedRoute = this._matchUrlToRoute(path);
		if (!matchedRoute) {
			throw new Error('404: Route not found');
		}

		this._internalRoute.value = matchedRoute;
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
		this._internalRoute.subscribe((page) => {
			if (page == null) {
				return null;
			}

			parent.innerHTML = '';
			renderElements(page.render(), parent);
		});
	}

};
