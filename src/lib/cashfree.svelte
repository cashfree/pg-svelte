<script lang="ts">
	import { onMount, setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { key } from './context-key.js';
	import { load } from '@cashfreepayments/cashfree-js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let mode: 'sandbox' | 'production' = 'sandbox';
	export let styles: Record<string, any> = {};

	let rootEvents = [
		{ eventName: 'ready' },
		{ eventName: 'complete' },
		{ eventName: 'paymentrequested' },
		{ eventName: 'change' },
		{ eventName: 'loaderror' }
	];

	function dispatchState(e: CustomEvent<any>): void {
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

		root.addEventListener('register', ((e: CustomEvent) => {
			cashfreeComponents.push(e.detail);
		}) as EventListener);

		//add complete event listener, all the component references should be complete
		root.addEventListener('complete', ((e: CustomEvent) => {
			dispatchState(e);
		}) as EventListener);
		root.addEventListener('change', ((e: CustomEvent) => {
			dispatchState(e);
		}) as EventListener);
		root.addEventListener('click', ((e: CustomEvent) => {
			dispatch('click', e);
		}) as EventListener);
		root.addEventListener('paymentrequested', ((e: CustomEvent) => {
			dispatch('paymentrequested', e);
		}) as EventListener);
		root.addEventListener('loaderror', ((e: CustomEvent) => {
			dispatch('loaderror', e);
		}) as EventListener);
	});

	onDestroy(() => {});

	let payableComponents = ['cardNumber', 'upiQr', 'upiApp', 'upiCollect', 'netbanking', 'wallet'];

	function returnPayableComponent(): any {
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

	function dispatchError(message: string): void {
		dispatch('error', new Error(message));
	}

	export function pay(paymentOptions: Record<string, any>): Promise<any> {
		let payableComponent = returnPayableComponent();
		if (!payableComponent) {
			throw new Error('No payable component found');
		}
		paymentOptions.paymentMethod = payableComponent;
		// paymentOptions.savePaymentInstrument = components.savePaymentInstrument;
		return root.cashfree.pay(paymentOptions);
	}

	let { class: className = '' } = $$props;
	let root: any;
	let cashfreeComponents: any[] = [];
</script>

<div class={className} bind:this={root} data-cashfree-root>
	{#if !!root && !!root.cashfree}
		<slot></slot>
	{/if}
</div>
