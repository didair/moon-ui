import { createElement, ElementProps } from "../../element";

/**
 * Type: BASE
 * Description: Creates an HTML anchor element
 */
export const Link = (props: ElementProps) => {
	return createElement({
		tag: 'a',
		...props,
	});
};
