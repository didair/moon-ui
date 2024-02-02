import { createElement, ElementProps } from "../../element";

/**
 * Type: BASE
 * Description: Creates an HTML img element
 */
export const Img = (props: ElementProps) => {
	return createElement({
		tag: 'img',
		...props,
	});
};
