<script>
	import { getContext } from 'svelte';
	import { key } from './context-key';
	import { onMount, onDestroy } from 'svelte';
	//event dispatcher
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Accept class as a prop
	export let className = '';
	export let styleList = '';
	export let values = {
		placeholder: '4xxx xxxx xxxx 1234'
	};
	export { className as class };
	export { styleList as style };

	const { x, env, cashfree, style } = getContext(key);

	let element;
	export let component;

	function startEvents() {
		component.on('ready', function (d) {
			dispatch('ready', d);
		});
	}

	onMount(() => {
		component = $cashfree.create('cardNumber', {
			values,
			style: $style
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
