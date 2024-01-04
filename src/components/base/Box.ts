import { createElement, ElementProps } from "../../element";

export const Box = (props: ElementProps) => {
	return createElement({
		tag: 'div',
		...props,
	});
};
