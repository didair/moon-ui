
const globalEvents = {
	scroll: [],
	keydown: [],
	click: [],
	mousemove: [],
};

export type AllowedEventKeys = keyof typeof globalEvents;

export const bindNodeGlobalEvents = (node: HTMLElement, event: string, callback: Function) => {
	if (event.indexOf('scroll') > -1) {
		globalEvents.scroll.push(callback);
		return true;
	}

	if (event.indexOf('keydown') > -1) {
		globalEvents.keydown.push(callback);
		return true;
	}

	if (event.indexOf('click') > -1) {
		globalEvents.click.push(callback);
		return true;
	}

	if (event.indexOf('mousemove') > -1) {
		globalEvents.mousemove.push(callback);
		return true;
	}

	return false;
};

export const bindNodeLocalEvents = (node: HTMLElement, event: AllowedEventKeys, callback: Function) => {
	node.addEventListener(event, (callback as any));
};

export const bindGlobalEvents = () => {
	const onScroll = (event) => {
		if (globalEvents.scroll.length > 0) {
			globalEvents.scroll.forEach((callback) => {
				callback(event.target.scrollingElement.scrollTop);
			});
		}
	};

	const onMouseMove = (event) => {
		if (globalEvents.mousemove.length > 0) {
			globalEvents.mousemove.forEach((callback) => {
				callback(event);
			});
		}
	};

	const onClick = (event) => {
		if (globalEvents.click.length > 0) {
			globalEvents.click.forEach((callback) => {
				callback(event);
			});
		}
	};

	const onKeyDown = (event) => {
		if (globalEvents.keydown.length > 0) {
			globalEvents.keydown.forEach((callback) => {
				callback(event);
			});
		}
	};

	window.addEventListener('scroll', onScroll);
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('click', onClick);
	document.addEventListener('keydown', onKeyDown);
};
