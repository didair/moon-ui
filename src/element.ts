import { ReadonlySignal, Signal } from "@preact/signals-core";
import { isSignal } from "./signals";
import { GlobalEventKeys, bindNodeGlobalEvents } from "./events";

export type AllowedNodeTypes = HTMLDivElement | HTMLButtonElement | HTMLAnchorElement | HTMLImageElement | HTMLSpanElement;
export type AllowedTagTypes = keyof HTMLElementTagNameMap;

export interface ElementProps {
	children?: any,
	onMount?: (node: HTMLElement) => void,
	class?: string | (() => Array<string> | string) | ReadonlySignal | Signal,
	style?: string | CSSStyleDeclaration,
	then?: Function,
	value?: number | string | Signal | ReadonlySignal,
	subscribe?: Function,
	props?: Object,
	id?: string | Signal | ReadonlySignal,
	globalEvents?: {
		[K in GlobalEventKeys]?: () => void;
	},
};

export interface CreateElementProps extends ElementProps {
	tag: AllowedTagTypes,
};

export const createElement = ({
	tag = 'div',
	...rest
}: CreateElementProps): CreateElementProps => {
	return {
		tag,
		...rest
	};
};

export const handleElementLifecycles = (element: ElementProps, node: HTMLElement) => {
	if (element.onMount != null && typeof element.onMount === 'function') {
		setTimeout(() => {
			element.onMount(node);
		});
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

export const applyElementAttributes = (element: CreateElementProps, node: AllowedNodeTypes) => {
	const safeProps = { ...element };
	const safeEvents = ['onclick', 'onhover', 'onmousedown', 'onmouseup', 'onleave', 'onfocus'];

	// Todo: Can we do this automatically instead? Maybe from reading the ElementProps int
	delete safeProps.globalEvents;
	delete safeProps.children;
	delete safeProps.class;
	delete safeProps.onMount;
	delete safeProps.style;
	delete safeProps.tag;
	delete safeProps.props;

	if (element.globalEvents != null) {
		Object.keys(element.globalEvents).forEach((eventType: string) => {
			bindNodeGlobalEvents(node, eventType, element.globalEvents[eventType]);
		});
	}

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
