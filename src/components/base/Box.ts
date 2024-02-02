import { createElement, ElementProps } from "../../element";

/**
 * Type: BASE
 * Description: Creates an HTML div element
 */
export const Box = (props: ElementProps) => {
	return createElement({
		tag: 'div',
		...props,
	});
};
