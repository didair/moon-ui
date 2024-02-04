import { Router } from "./Router";

const isExternal = (url) => {
	var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
	if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
	if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return true;
	return false;
}

export const attachAnchorEvents = () => {
	if ((window as any).routerContext == null) {
		return {};
	}

	const router: Router = (window as any).routerContext;

	return {
		onClick: (event: Event) => {
			const href = (event.target as HTMLAnchorElement).getAttribute('href');
			if (href != null && !isExternal(href)) {
				event.preventDefault();
				router.navigate(href);
			}
		}
	};
};