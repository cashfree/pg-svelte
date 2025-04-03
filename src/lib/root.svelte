<script>
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { key } from './context-key';
	import { load } from '@cashfreepayments/cashfree-js';

	export let env = 'sandbox';
	export let styles = {};

	// Create a writable store for the cashfree instance
	const cashfreeStore = writable(null);
	const stylesStore = writable(null);
	const statusStore = writable({
		loading: true,
		error: null,
		complete: false
	});
	const componentsStore = writable(null);

	// Set context with the store - only once during initialization
	setContext(key, {
		env,
		cashfree: cashfreeStore,
		stylesGlobal: stylesStore,
		status: statusStore,
		components: componentsStore
	});

	onMount(async function () {
		const instance = await load({
			mode: 'sandbox'
		});
		// Update the store, not the context
		cashfreeStore.set(instance);
		stylesStore.set(styles);
		statusStore.set({
			loading: false,
			error: null,
			complete: true
		});
		componentsStore.set({});
	});

	$: {
		//log values of stateStore
		componentsStore.subscribe((components) => {
			//foeach key check is complete
			for (const key in components) {
				// if (components[key].isComplete()) {
				// 	// statusStore.update((status) => ({
				// 	// 	...status,
				// 	// 	complete: true
				// 	// }));
				// 	console.log('>>>>>>----  root:54 ', key, components[key].isComplete());
				// }
				console.log('>>>>>>----  root:54 ', key, components[key].isComplete());
			}
		});
	}
</script>

<div>
	{#if $cashfreeStore}
		<slot></slot>
	{/if}
</div>
