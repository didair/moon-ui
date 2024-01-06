import { Signal } from "@preact/signals-core";
import { applyElementStyles, handleElementLifecycles, applyElementAttributes, ElementProps } from "./element";
import { getSignalChildren, isSignal } from "./signals";

export const render = (elementList: Array<ElementProps>, parent: HTMLElement = null) => {
	elementList.forEach(async (element) => {
		if (element.then != null && typeof element.then === 'function') {
			// Support for async components
			element.then((asyncElement) => {
				renderElement(asyncElement, parent);
			});

			return;
		}

		if (isSignal(element)) {
			renderText(element.value + '', parent);
			return true;
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

export const prerender = (elementList: Array<ElementProps>) => {
	const node = document.createElement('body');

	// elementList.forEach((element) =>
	// 	element.type == 'text' ?
	// 		renderText(element, node)
	// 	: renderElement(element, node)
	// );

	return node.outerHTML;
};

const renderElement = (element: ElementProps, parent = null) => {
	const node = document.createElement(element.tag);

	if (element.children != null) {
		renderElementChildren(element, node);

		const signals = getSignalChildren(element.children);
		if (signals.length > 0) {
			console.log('signals in element', element, signals);
			signals.forEach((signal: Signal) => {
				signal.subscribe((value) => {
					onSignalChange(value, element, node);
				});
			});
		}
	}

	applyElementAttributes(element, node);
	applyElementStyles(element, node);
	handleElementLifecycles(element);

	if (parent != null) {
		parent.appendChild(node);
		return true;
	}

	document.body.appendChild(node);
};

const renderElementChildren = (element: ElementProps, node) => {
	if (Array.isArray(element.children)) {
		render(element.children, node);
	}
	
	if (!Array.isArray(element.children) && typeof element.children === 'object') {
		// Convert to array
		render([element.children], node);
	}

	if (typeof element.children === 'string') {
		node.innerText = element.children;
	}
};

const onSignalChange = (value, element, node) => {
	node.innerHTML = '';
	renderElementChildren(element, node);
};

const renderText = (text: string, parent = null) => {
	const node = document.createTextNode(text);

	if (parent != null) {
		parent.appendChild(node);
		return true;
	}

	document.body.appendChild(node);
};