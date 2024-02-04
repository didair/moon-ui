import { Router } from "./Router";

export const attachAnchorEvents = () => {
	if ((window as any).routerContext == null) {
		return {};
	}

	const router: Router = (window as any).routerContext;

	return {
		onClick: (event: Event) => {
			event.preventDefault();
			const href = (event.target as HTMLAnchorElement).getAttribute('href');
			router.navigate(href);
		}
	};
};