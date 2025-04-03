<script>
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { key } from './context-key';
	import { load } from '@cashfreepayments/cashfree-js';

	let x = 100;
	export let env = 'sandbox';
	export let styleObject = {};

	// Create a writable store for the cashfree instance
	const cashfreeStore = writable(null);
	const styleStore = writable(null);

	// Set context with the store - only once during initialization
	setContext(key, { x, env, cashfree: cashfreeStore, style: styleStore });

	onMount(async function () {
		const instance = await load({
			mode: 'sandbox'
		});
		// Update the store, not the context
		cashfreeStore.set(instance);
		styleStore.set(styleObject);
	});
</script>

<div>
	{#if $cashfreeStore}
		<slot></slot>
		<slot name="CardNumber"></slot>
	{/if}
	<slot></slot>
</div>
