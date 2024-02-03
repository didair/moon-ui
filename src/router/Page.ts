import { ElementProps } from "../element";

export interface IPage {
	path: string;
	render(): void;
};

export class Page {
	path: string;

	constructor() {
		this.path = '/';
	};

	render() {
		return null;
	}
};

