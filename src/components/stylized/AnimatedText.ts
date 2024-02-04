import { Box } from "../base/Box";
import { createElement, ElementProps } from "../../element";
import { signal } from "@preact/signals-core";

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
	const content = signal(' ');
	let charIndex = 0;

	const attachDocumentStyle = () => {
		if (!document.getElementById('moonly-animated-text-css') && showCursor) {
			const styles = document.createElement('style');
			styles.innerHTML = `
				.animated-text {
					position: relative;
				}

				.animated-text:after {
					content: ' ';
					position: absolute;
					background-color: currentColor;
					animation: blink 1.12s infinite;
					animation-delay: ${speed * children.length}ms;
					height: 80%;
					top: 10%;
					margin-left: 4%;
				}

				@keyframes blink {
					0% { opacity: 0; }
					50% { opacity: 1; }
					100% { opacity: 0; }
				}
			`;

			styles.id = 'moonly-animated-text-css';
			document.head.appendChild(styles);
		}
	}

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

	attachDocumentStyle();
	setTimeout(addCharacter, speed);

	return createElement({
		...props,
		tag: 'span',
		children: [
			Box({
				tag: 'span',
				class: 'animated-text',
				children: content,
			})
		],
	});
};
