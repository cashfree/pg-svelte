<script>
	import { onMount, setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { key } from './context-key';
	import { load } from '@cashfreepayments/cashfree-js';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let mode = 'sandbox';
	export let styles = {};

	let rootEvents = [
		{ eventName: 'ready' },
		{ eventName: 'complete' },
		{ eventName: 'paymentrequested' },
		{ eventName: 'change' },
		{ eventName: 'loaderror' }
	];

	function dispatchState(e) {
		for (let i = 0; i < cashfreeComponents.length; i++) {
			let component = cashfreeComponents[i];
			let name = component.componentName;
			let reference = component.componentReference;
			if (!reference.isComplete()) {
				dispatch('complete', {
					isComplete: false,
					componentName: name
				});
				return;
			}
		}
		dispatch('complete', {
			isComplete: true
		});
	}

	onMount(async function () {
		root.styles = styles;
		root.cashfree = await load({
			mode: mode
		});

		root.addEventListener('register', (e) => {
			cashfreeComponents.push(e.detail);
		});

		//add complete event listener, all the component references should be complete
		root.addEventListener('complete', (e) => {
			dispatchState(e);
		});
		root.addEventListener('change', (e) => {
			dispatchState(e);
		});
		root.addEventListener('click', (e) => {
			dispatch('click', e);
		});
		root.addEventListener('paymentrequested', (e) => {
			dispatch('paymentrequested', e);
		});
		root.addEventListener('loaderror', (e) => {
			dispatch('loaderror', e);
		});
	});

	onDestroy(() => {});

	let payableComponents = ['cardNumber', 'upiQr', 'upiApp', 'upiCollect'];

	function returnPayableComponent() {
		for (let i = 0; i < cashfreeComponents.length; i++) {
			let component = cashfreeComponents[i];
			let name = component.componentName;
			let reference = component.componentReference;
			if (payableComponents.includes(name)) {
				return reference;
			}
		}
		return null;
	}

	function dispatchError(message) {
		dispatch('error', new Error(message));
	}

	export function pay(paymentOptions) {
		let payableComponent = returnPayableComponent();
		if (!payableComponent) {
			throw new Error('No payable component found');
		}
		paymentOptions.paymentMethod = payableComponent;
		// paymentOptions.savePaymentInstrument = components.savePaymentInstrument;
		return root.cashfree.pay(paymentOptions);
	}

	let { class: className = '' } = $$props;
	let root;
	let cashfreeComponents = [];
</script>

<div class={className} bind:this={root} data-cashfree-root>
	{#if !!root && !!root.cashfree}
		<slot></slot>
	{/if}
</div>
