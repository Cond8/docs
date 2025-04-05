// public/cond8-dev.js

document.fonts.ready.then(() => {
	document.documentElement.classList.add('fonts-loaded');
});

Promise.race([document.fonts.ready, new Promise(res => setTimeout(res, 1000))]).then(() => {
	document.documentElement.classList.add('fonts-loaded');
});

// cond8-client.js
export function enableCopyToClipboard() {
	document.addEventListener('click', e => {
		const target = e.target;
		if (target.matches('[data-copy]')) {
			const value = target.getAttribute('data-copy');
			if (value) {
				navigator.clipboard.writeText(value).then(() => {
					console.log('Copied:', value);
				});
			}
		}
	});
}
