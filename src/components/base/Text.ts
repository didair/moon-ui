import { createElement, ElementProps } from "../../element";

export const Text = (children: ElementProps) => {
	return createElement({
		tag: 'div',
		type: 'text',
		children: children,
	});
};