// public/cond8-dev.js
document.fonts.ready.then(() => {
	document.documentElement.classList.add('fonts-loaded');
});

Promise.race([document.fonts.ready, new Promise(res => setTimeout(res, 1000))]).then(() => {
	document.documentElement.classList.add('fonts-loaded');
});
