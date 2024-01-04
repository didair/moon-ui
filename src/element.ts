export interface ElementProps {
	tag: 'div' | 'button' | 'a' | 'img' | 'span',
	type: 'element' | 'text',
	children?: any,
	onMount?: Function,
	class?: string | (() => Array<string> | string),
	style?: string | CSSStyleDeclaration,
	then?: Function,
};

export type AllowedNodeTypes = HTMLDivElement | HTMLButtonElement | HTMLAnchorElement | HTMLImageElement | HTMLSpanElement;

export const createElement = ({
	tag = 'div',
	type = 'element',
	...rest
}: ElementProps) => {
	return {
		tag,
		type,
		...rest
	};
};

export const handleElementLifecycles = (element: ElementProps) => {
	if (element.onMount != null && typeof element.onMount === 'function') {
		element.onMount();
	}
};

export const applyElementStyles = (element: ElementProps, node: AllowedNodeTypes) => {
	if (element.style != null) {
		if (typeof element.style === 'object') {
			Object.keys(element.style).forEach((property) => {
				node.style[property] = element.style[property];
			});
		}

		if (typeof element.style === 'string') {
			const existingStyles = node.getAttribute('style') ?? '';
			node.setAttribute('style', (existingStyles + ' ' + element.style).trim());
		}
	}

	if (element.class != null) {
		if (typeof element.class === 'function') {
			let calculatedClassList = element.class();

			if (typeof calculatedClassList === 'string') {
				calculatedClassList = calculatedClassList.split(' ');
			}

			if (typeof calculatedClassList === 'object' && Array.isArray(calculatedClassList)) {
				calculatedClassList
				.filter((c) => c != '')
				.forEach((className) => node.classList.add(className));
			}
		}

		if (typeof element.class === 'string') {
			element.class.split(' ')
			.filter((c) => c != '')
			.forEach((className) => node.classList.add(className));
		}
	}
};

export const applyElementAttributes = (element: ElementProps, node: AllowedNodeTypes) => {
	const safeProps = { ...element };

	// Todo: Can we do this automatically instead? Maybe from reading the ElementProps int
	delete safeProps.children;
	delete safeProps.class;
	delete safeProps.onMount;
	delete safeProps.style;
	delete safeProps.tag;
	delete safeProps.type;

	Object.keys(safeProps).forEach((propKey) => {
		node.setAttribute(propKey, safeProps[propKey]);
	});
};