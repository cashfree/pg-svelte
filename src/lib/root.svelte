<script>
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { key } from './context-key';
	import { load } from '@cashfreepayments/cashfree-js';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let mode = 'sandbox';
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
		mode,
		cashfree: cashfreeStore,
		stylesGlobal: stylesStore,
		components: componentsStore
	});
	let instance = null;
	onMount(async function () {
		instance = await load({
			mode: mode
		});
		// Update the store, not the context
		cashfreeStore.set(instance);
		stylesStore.set(styles);
		componentsStore.set({});
		state.loading = false;
	});

	let components = {};
	let state = {
		complete: false,
		loading: true
	};

	componentsStore.subscribe((data) => {
		components = data;
		state.complete = true;
		for (const key in components) {
			if (components[key].isComplete()) {
				state.complete = state.complete && true;
			} else {
				state.complete = state.complete && false;
			}
		}
		dispatch('state', state);
	});

	export function pay(paymentOptions) {
		paymentOptions.paymentMethod = components.cardNumber;
		paymentOptions.savePaymentInstrument = components.savePaymentInstrument;
		return instance.pay(paymentOptions);
	}
</script>

<div>
	{#if $cashfreeStore}
		<slot></slot>
	{/if}
</div>
