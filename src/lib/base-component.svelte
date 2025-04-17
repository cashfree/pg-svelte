<script lang="ts">
	import { getContext } from 'svelte';
	import { key } from './context-key.js';
	import { onMount, onDestroy } from 'svelte';
	//event dispatcher
	import { createEventDispatcher } from 'svelte';
	import events from './events.js';

	const dispatch = createEventDispatcher();

	// Accept class as a prop
	export let className = '';
	export let type: string;

	let parent: any;
	export let values: Record<string, any> = {};
	export let styles: Record<string, any> = {};

	export { className as class };
	export let styleList = '';
	export { styleList as style };

	let element: HTMLElement;
	export let component: any; //cashfree component

	let eventsToBubble = [
		{ eventName: 'ready' },
		{ eventName: 'focus' },
		{ eventName: 'blur' },
		{ eventName: 'invalid' },
		{ eventName: 'change' },
		{ eventName: 'empty' },
		{ eventName: 'complete' },
		{ eventName: 'click' },
		{ eventName: 'paymentrequested' },
		{ eventName: 'loaderror' }
	];

	function startEvents() {
		//do register events
		events.dispatchCustomEvent(parent, 'register', {
			componentName: type,
			componentReference: component
		});

		for (let i = 0; i < eventsToBubble.length; i++) {
			const event = eventsToBubble[i];
			// Note: callback is not used in the code, so we can remove it
			// const callback = event.callback;

			component.on(event.eventName, function (d: any) {
				events.dispatchCustomEvent(parent, event.eventName, d);
			});
		}
	}
	function merge2Levels(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
		const result = { ...obj1 };
		for (const key in obj2) {
			if (obj2.hasOwnProperty(key)) {
				if (
					typeof obj2[key] === 'object' &&
					obj2[key] !== null &&
					result.hasOwnProperty(key) &&
					typeof result[key] === 'object' &&
					result[key] !== null
				) {
					result[key] = { ...result[key], ...obj2[key] };
				} else {
					result[key] = obj2[key];
				}
			}
		}
		return result;
	}
	onMount(() => {
		parent = element.closest('[data-cashfree-root]');
		if (!parent) {
			throw new Error('Cashfree root not found');
		}

		styles = merge2Levels(parent.styles, styles);
		component = parent.cashfree.create(type, {
			values,
			style: styles
		});

		component.mount(element);
		startEvents();
	});
	onDestroy(() => {
		if (component) {
			component.unmount();
		}
	});
</script>

<div bind:this={element} class={className} style={styleList}></div>
