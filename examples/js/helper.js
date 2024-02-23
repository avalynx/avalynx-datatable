document.addEventListener('DOMContentLoaded', () => {
	const modeToggle = document.getElementById('modeToggle');
	if (modeToggle !== null) {
		modeToggle.addEventListener('click', () => {
			const currentTheme = document.documentElement.getAttribute('data-bs-theme');
			const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
			document.documentElement.setAttribute('data-bs-theme', newTheme);
			modeToggle.textContent = `Toggle to ${newTheme === 'dark' ? 'Light' : 'Dark'} Mode`;
		});
	}
});