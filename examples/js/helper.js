document.addEventListener('DOMContentLoaded', () => {
	const modeToggle = document.getElementById('modeToggle');
	if (modeToggle !== null) {
		modeToggle.addEventListener('click', () => {
			const currentTheme = document.documentElement.getAttribute('data-bs-theme');
			const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
			document.documentElement.setAttribute('data-bs-theme', newTheme);
			modeToggle.textContent = `Toggle to ${newTheme === 'dark' ? 'Light' : 'Dark'} Mode`;

			const hljsTheme = document.getElementById('hljsTheme');
			if (hljsTheme !== null) {
				cssTheme = newTheme === 'light' ? 'stackoverflow-light' : 'stackoverflow-dark';
				hljsTheme.setAttribute('href', `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9/build/styles/${cssTheme}.min.css`);
			}
		});
	}

	const copyButton = document.getElementById('copyButton');
	if (copyButton !== null) {
		copyButton.addEventListener('click', () => {
			const code = document.getElementById('codeBlock').innerText;
			navigator.clipboard.writeText(code).then(() => {
				copyButton.textContent = 'Copied!';
			}).catch(err => {
				console.error('Error copying text: ', err);
			});
		});
	}
});