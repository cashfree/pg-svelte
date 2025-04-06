<script>
	import { getContext } from 'svelte';
	import { key } from './context-key';
	import { onMount, onDestroy } from 'svelte';
	//event dispatcher
	import { createEventDispatcher } from 'svelte';
	import events from './events';

	const dispatch = createEventDispatcher();

	// Accept class as a prop
	export let className = '';
	export let type;

	let parent;
	export let values = {};
	export let styles = {};

	export { className as class };
	export let styleList = '';
	export { styleList as style };

	let element;
	export let component; //cashfree component

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
			const callback = event.callback;

			component.on(event.eventName, function (d) {
				events.dispatchCustomEvent(parent, event.eventName, d);
			});
		}
	}

	onMount(() => {
		parent = element.closest('[data-cashfree-root]');
		if (!parent) {
			throw new Error('Cashfree root not found');
		}
		styles = {
			...parent.styles,
			...styles
		};
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
