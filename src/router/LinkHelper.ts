import { Router } from "./Router";

const isExternalURL = (url) => new URL(url).origin !== location.origin;

export const attachAnchorEvents = () => {
	if ((window as any).routerContext == null) {
		return {};
	}

	const router: Router = (window as any).routerContext;

	return {
		onClick: (event: Event) => {
			const href = (event.target as HTMLAnchorElement).getAttribute('href');
			if (!isExternalURL(href)) {
				event.preventDefault();
				router.navigate(href);
			}
		}
	};
};