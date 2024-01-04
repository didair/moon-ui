import { createElement, ElementProps } from "../../element";

export const Img = (props: ElementProps) => {
	return createElement({
		tag: 'img',
		...props,
	});
};
