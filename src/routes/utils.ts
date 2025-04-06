export function getMode() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('mode') || 'sandbox';
}
