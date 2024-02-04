import { createElement, ElementProps } from "../../element";
import { attachAnchorEvents } from "../../router/LinkHelper";

/**
 * Type: BASE
 * Description: Creates an HTML anchor element
 */
export const Link = (props: ElementProps) => {
	return createElement({
		tag: 'a',
		...attachAnchorEvents(),
		...props,
	});
};
