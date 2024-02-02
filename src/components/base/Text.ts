import { createElement, ElementProps } from "../../element";

export const Text = (props: ElementProps) => {
	return createElement({
		tag: 'span',
		...props,
	});
};