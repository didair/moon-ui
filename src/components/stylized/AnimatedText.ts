import { createElement, ElementProps } from "../../element";
import { computed, signal } from "@preact/signals-core";

interface AnimatedTextProps extends ElementProps {
	speed?: number;
	showCursor?: boolean,
	children: string,
};

/**
 * Type: STYLIZED
 * Description: Animates the text given in children with a type-writer like effect
 */
export const AnimatedText = ({
	children = ' ',
	speed = 115,
	showCursor = false,
	...props
}: AnimatedTextProps) => {
	let content = signal(' ');
	let charIndex = 0;

	const addCharacter = () => {
		if (charIndex == 0) {
			content.value = children[charIndex];
		} else {
			content.value += children[charIndex];
		}

		charIndex++;
		if (charIndex < children.length) {
			setTimeout(addCharacter, speed);
		}
	};

	setTimeout(addCharacter, speed);

	return createElement({
		...props,
		id: content,
		tag: 'span',
		children: [content],
	});
};
