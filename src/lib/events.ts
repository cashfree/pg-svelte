/**
 * Creates a custom event with the given name and detail data
 * @param name The name of the custom event
 * @param detail The data to be passed with the event
 * @returns CustomEvent object
 */
function createCustomEvent(name: string, detail?: any): CustomEvent {
	return new CustomEvent(name, { bubbles: false, detail });
}

//document.querySelector('[data-cashfree-root]').dispatchEvent(new CustomEvent('register', { bubbles: false, {detail:1} }))

/**
 * Dispatches a custom event on the specified target element
 * @param target The DOM element to dispatch the event on
 * @param name The name of the custom event
 * @param detail The data to be passed with the event
 * @returns Boolean indicating if the event was canceled
 */
function dispatchCustomEvent(target: EventTarget, name: string, detail?: any): boolean {
	const event = createCustomEvent(name, detail);
	return target.dispatchEvent(event);
}

// Default export with both functions
export default {
	createCustomEvent,
	dispatchCustomEvent
};
