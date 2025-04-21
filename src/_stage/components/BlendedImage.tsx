import { FunctionalComponent } from 'preact';
import { JSX } from 'preact/jsx-runtime';

/**
 * BlendedImage
 * Renders an image with a gradient fade on the edges to blend into the background.
 *
 * Props:
 * - src: string (image source)
 * - alt: string (image alt text)
 * - background: string (optional, CSS color value to blend into)
 * - style: React.CSSProperties (optional, additional styles)
 * - className: string (optional, additional class names)
 * - children: React.ReactNode (optional, overlays or captions)
 * - gradientOptions: object (optional, gradient customization)
 *      - shape: string (CSS gradient shape, e.g. 'circle' or 'ellipse')
 *      - center: string (CSS position, e.g. '50% 50%')
 *      - innerStop: string (where the solid color stops, e.g. '70%')
 *      - outerStop: string (where the fade ends, e.g. '100%')
 *      - color: string (the solid color in the center, e.g. 'white')
 *      - transparent: string (the transparent color at the edge, e.g. 'transparent')
 */
interface GradientOptions {
	shape?: string;
	center?: string;
	innerStop?: string;
	outerStop?: string;
	color?: string;
	transparent?: string;
}

interface BlendedImageProps {
	src: string;
	alt: string;
	background?: string;
	style?: JSX.CSSProperties;
	className?: string;
	children?: preact.ComponentChildren;
	gradientOptions?: GradientOptions;
}

const BlendedImage: FunctionalComponent<BlendedImageProps> = ({
	src,
	alt,
	background = 'var(--background, #fff)',
	style,
	className = '',
	children,
	gradientOptions = {},
}) => {
	const {
		shape = 'circle',
		center = '50% 50%',
		innerStop = '70%',
		outerStop = '100%',
		color = 'white',
		transparent = 'transparent',
	} = gradientOptions || {};

	return (
		<div
			className={'blended-image-container ' + className}
			style={{
				position: 'relative',
				display: 'inline-block',
				overflow: 'hidden',
				background,
				...style,
			}}
		>
			<picture>
				{/* fallback image for browsers that don't support mask-image */}
				<img
					src={src}
					alt={alt}
					style={{
						display: 'block',
						width: '100%',
						height: 'auto',
						background,
						WebkitMaskImage: `radial-gradient(${shape} at ${center}, ${color} ${innerStop}, ${transparent} ${outerStop})`,
						maskImage: `radial-gradient(${shape} at ${center}, ${color} ${innerStop}, ${transparent} ${outerStop})`,
					}}
					className="blended-image"
				/>
			</picture>
			{children && (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 0,
						top: 0,
						pointerEvents: 'none',
					}}
				>
					{children}
				</div>
			)}
		</div>
	);
};

export default BlendedImage;
