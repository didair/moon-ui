import { createElement, ElementProps } from "../../element";

export const Link = (props: ElementProps) => {
	return createElement({
		tag: 'a',
		...props,
	});
};
