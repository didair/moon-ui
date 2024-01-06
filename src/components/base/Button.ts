import { createElement, ElementProps } from "../../element";

export const Button = (props: ElementProps) => {
	return createElement({
		tag: 'button',
		...props,
	});
};
