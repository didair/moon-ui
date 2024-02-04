import { CreateElementProps } from "../element";

export type PageLayoutType = (children: Array<CreateElementProps> | CreateElementProps) => Array<CreateElementProps> | CreateElementProps;

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

