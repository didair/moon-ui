
export const isSignal = (signal) => {
	return typeof signal === 'object' && signal.value != null && signal.subscribe != null;
};

export const getSignalChildren = (children) => {
	if (Array.isArray(children)) {
		return children.filter((child) => isSignal(child));
	}

	if (typeof children === 'object' && isSignal(children)) {
		return [children];
	}

	return [];
};