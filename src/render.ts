import { applyElementStyles, handleElementLifecycles, applyElementAttributes, ElementProps } from "./element";

export const render = (elementList: Array<ElementProps>, parent: HTMLElement = null) => {
	elementList.forEach(async (element) => {
		if (element.then != null && typeof element.then === 'function') {
			// Support for async components
			element.then((asyncElement) => {
				renderElement(asyncElement, parent);
			});

			return;
		}

		if (element.type == 'text') {
			renderText(element, parent)
			return;
		}

		if (typeof element === 'string') {
			// Allow passing string in children list
			const children: string = element;
			renderText({
				tag: 'div',
				type: 'text',
				children,
			}, parent);

			return;
		}

		renderElement(element, parent)
	});
};

export const prerender = (elementList: Array<ElementProps>) => {
	const node = document.createElement('body');

	elementList.forEach((element) =>
		element.type == 'text' ?
			renderText(element, node)
		: renderElement(element, node)
	);

	return node.outerHTML;
};

const renderElement = (element: ElementProps, parent = null) => {
	const node = document.createElement(element.tag);

	if (element.children != null) {
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

const renderText = (element: ElementProps, parent = null) => {
	const node = document.createTextNode(element.children);

	if (parent != null) {
		parent.appendChild(node);
		return true;
	}

	document.body.appendChild(node);
};