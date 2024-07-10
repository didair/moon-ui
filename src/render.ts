import { Signal } from "@preact/signals-core";
import { applyElementStyles, handleElementLifecycles, applyElementAttributes, CreateElementProps } from "./element";
import { getSignalChildren, getSignalsInProps, isSignal } from "./signals";

/**
 * Renders given list of elements.
 * @param elementList List of elements
 * @param parent Where to render
 */
export const render = (elementList: Array<CreateElementProps>, parent: HTMLElement = null) => {
	elementList.forEach(async (element) => {
		if (element.then != null && typeof element.then === 'function') {
			// Support for async components
			element.then((asyncElement) => {
				renderElement(asyncElement, parent);
			});

			return;
		}

		if (Array.isArray(element)) {
			// If element returns array
			element.forEach((e) => renderElement(e, parent));
			return;
		}

		if (isSignal(element)) {
			renderText(element.value + '', parent);
			return;
		}

		if (typeof element === 'string') {
			// Allow passing string in children list
			const children: string = element;
			renderText(children, parent);

			return;
		}

		renderElement(element, parent)
	});
};

/**
 * Not supported
 * @param elementList List of elements
 * @returns Generated HTML (string)
 */
export const prerender = (elementList: Array<CreateElementProps>) => {
	const node = document.createElement('body');

	// elementList.forEach((element) =>
	// 	element.type == 'text' ?
	// 		renderText(element, node)
	// 	: renderElement(element, node)
	// );

	return node.outerHTML;
};

const renderElement = (element: CreateElementProps, parent = null) => {
	const node = document.createElement(element.tag);

	if (element.children != null) {
		renderElementChildren(element, node);

		const signals = [
			...getSignalChildren(element.children),
			...getSignalsInProps(element.props),
		];

		if (signals.length > 0) {
			signals.forEach((signal: Signal) => {
				signal.subscribe((value) => {
					onSignalChange(value, element, node);
				});
			});
		}
	}

	applyElementAttributes(element, node);
	applyElementStyles(element, node);
	handleElementLifecycles(element, node);

	if (parent != null) {
		parent.appendChild(node);
		return true;
	}

	document.body.appendChild(node);
};

const renderElementChildren = (element: CreateElementProps, node) => {
	let children = element.children;
	if (typeof element.children == 'function') {
		children = element.children(element.props);
	}

	if (Array.isArray(children)) {
		render(children, node);
	}
	
	if (!Array.isArray(children) && typeof children === 'object') {
		// Convert to array
		render([children], node);
	}

	if (typeof children === 'string') {
		node.innerText = children;
	}
};

const onSignalChange = (value, element, node) => {
	node.innerHTML = '';
	renderElementChildren(element, node);
	applyElementAttributes(element, node);
	applyElementStyles(element, node);
};

const renderText = (text: string, parent = null) => {
	const node = document.createTextNode(text);

	if (parent != null) {
		parent.appendChild(node);
		return true;
	}

	document.body.appendChild(node);
};