import { ReadonlySignal, Signal } from "@preact/signals-core";
import { isSignal } from "./signals";

export type AllowedNodeTypes = HTMLDivElement | HTMLButtonElement | HTMLAnchorElement | HTMLImageElement | HTMLSpanElement;
export type AllowedTagTypes = keyof HTMLElementTagNameMap;

export interface ElementProps {
	tag: AllowedTagTypes,
	children?: any,
	onMount?: Function,
	class?: string | (() => Array<string> | string) | ReadonlySignal | Signal,
	style?: string | CSSStyleDeclaration,
	then?: Function,
	value?: number | string | Signal | ReadonlySignal,
	subscribe?: Function,
	props?: Object,
	id?: string | Signal | ReadonlySignal,
};

export const createElement = ({
	tag = 'div',
	...rest
}: ElementProps): ElementProps => {
	return {
		tag,
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
		if (isSignal(element.class)) {
			(element.class as Signal).value.split(' ')
			.filter((c) => c != '')
			.forEach((className) => node.classList.add(className));
		}

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
	const safeEvents = ['onclick', 'onhover', 'onmousedown', 'onmouseup', 'onleave', 'onfocus'];

	// Todo: Can we do this automatically instead? Maybe from reading the ElementProps int
	delete safeProps.children;
	delete safeProps.class;
	delete safeProps.onMount;
	delete safeProps.style;
	delete safeProps.tag;
	delete safeProps.props;

	Object.keys(safeProps).forEach((propKey) => {
		if (safeEvents.indexOf(propKey.toLowerCase()) > -1) {
			// Bind event
			node[propKey.toLowerCase()] = safeProps[propKey];
		} else {
			// Bind attr
			if (isSignal(safeProps[propKey])) {
				// Bind signal as attribute
				node.setAttribute(propKey, (safeProps[propKey] as Signal).value);
			} else {
				node.setAttribute(propKey, safeProps[propKey]);
			}
		}
	});
};
