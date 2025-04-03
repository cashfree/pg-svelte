<script>
	import { getContext } from 'svelte';
	import { key } from './context-key';
	import { onMount, onDestroy } from 'svelte';

	// Accept class as a prop
	export let className = '';
	export let styleList = '';

	// Get any other props from $$props
	export { className as class };
	export { styleList as style };

	const { x, env, cashfree, style } = getContext(key);

	let element;
	let component;

	onMount(() => {
		component = $cashfree.create('cardNumber', {
			values: {
				placeholder: '4xxx xxxx xxxx 1234'
			},
			style: $style
		});

		component.mount(element);
	});
	onDestroy(() => {
		if (component) {
			component.unmount();
		}
	});
</script>

<div bind:this={element} class={className} style={styleList}></div>
