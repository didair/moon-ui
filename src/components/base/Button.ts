import { createElement, ElementProps } from "../../element";

/**
 * Type: BASE
 * Description: Creates an HTML button element
 */
export const Button = (props: ElementProps) => {
	return createElement({
		tag: 'button',
		...props,
	});
};
