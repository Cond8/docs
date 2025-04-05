// tailwind.config.js
export default {
	content: ['./src/**/*.{ts,tsx,js,jsx,html}', './public/**/*.html'],
	theme: {
		extend: {
			keyframes: {
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(0.25rem)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'fade-in-up': 'fade-in-up 0.4s ease-out both',
			},
		},
	},
	plugins: [],
};
