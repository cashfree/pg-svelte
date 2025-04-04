<script>
	import { getContext } from 'svelte';
	import { key } from './context-key';
	import { onMount, onDestroy } from 'svelte';
	//event dispatcher
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Accept class as a prop
	export let className = '';
	export let type;
	export let values = {};
	const { mode, cashfree, stylesGlobal, status, components } = getContext(key);
	export let styles = $stylesGlobal || {};

	export { className as class };
	export let styleList = '';
	export { styleList as style };

	let element;
	export let component;

	let eventsToBubble = [
		{ eventName: 'ready', callback: void 0 },
		{ eventName: 'focus', callback: void 0 },
		{ eventName: 'blur', callback: void 0 },
		{ eventName: 'invalid', callback: void 0 },
		{
			eventName: 'change',
			callback: function () {
				$components[type] = component;
			}
		},
		{ eventName: 'empty', callback: void 0 },
		{ eventName: 'complete', callback: void 0 },
		{ eventName: 'click', callback: void 0 },
		{ eventName: 'paymentrequested', callback: void 0 },
		{ eventName: 'loaderror', callback: void 0 }
	];

	function startEvents() {
		for (let i = 0; i < eventsToBubble.length; i++) {
			const event = eventsToBubble[i];
			const callback = event.callback;

			component.on(event.eventName, function (d) {
				if (callback) {
					component.on(event.eventName, callback);
				}
				dispatch(event.eventName, d);
			});
		}
	}

	onMount(() => {
		component = $cashfree.create(type, {
			values,
			style: styles
		});

		component.mount(element);
		startEvents();
		$components[type] = component;
	});
	onDestroy(() => {
		if (component) {
			component.unmount();
		}
	});
</script>

<div bind:this={element} class={className} style={styleList}></div>
