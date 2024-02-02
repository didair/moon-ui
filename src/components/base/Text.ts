import { createElement, ElementProps } from "../../element";

/**
 * Type: BASE
 * Description: Creates an HTML span element
 */
export const Text = (props: ElementProps) => {
	return createElement({
		tag: 'span',
		...props,
	});
};