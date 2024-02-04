import { ElementProps } from "../element";

export type PageLayoutType = (children: Array<ElementProps> | ElementProps) => Array<ElementProps> | ElementProps;

export interface IPage {
	path: string;
	render(): void;
	layout?: PageLayoutType;
};

export class Page {
	path: string;
	layout?: PageLayoutType;

	constructor() {
		this.path = '/';
	};

	render() {
		return null;
	}
};

