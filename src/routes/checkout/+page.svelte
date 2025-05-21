<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import { Cashfree } from '$lib';
	import { paymentSessionIdStore } from '../store.js';
	// Import with ?raw currently causing TypeScript errors, comment for now
	// import code from './+page.svelte?raw';

	import { getMode } from '../utils.js';

	let mode: 'sandbox' | 'production';

	onMount(() => {
		mode = getMode() as 'sandbox' | 'production';
	});

	let errorMsg = '';
	let cashfreeRoot: any;

	async function doCheckout(e: Event) {
		checkoutOptions.paymentSessionId = $paymentSessionIdStore;
		try {
			let res = await cashfreeRoot.checkout(checkoutOptions);
			if (!!res.error) {
				throw new Error(res.error.message);
			}
			if (res.redirect) {
				// This will be true when the payment redirection page couldnt be opened in the same window
				// This is an exceptional case only when the page is opened inside an inAppBrowser
				// In this case the customer will be redirected to return url once payment is completed
				console.log('Payment will be redirected');
			}
			if (res.paymentDetails) {
				// This will be called whenever the payment is completed irrespective of transaction status
				console.log('Payment has been completed, Check for Payment Status');
				console.log(res.paymentDetails.paymentMessage);
			}
		} catch (error: any) {
			errorMsg = error.message;
			console.error('Payment failed:', error);
		}
	}

	let checkoutOptions: Record<string, any> = {
		redirectTarget: '_modal'
	};

	// Extract UPICollect component for use in the template
</script>

<div class="flex flex-col gap-y-2 justify-left rounded-lg">
	<h1 class="text-lg font-bold text-blue-800">Demo of Cashfree Checkout {mode}</h1>
</div>

<div class="flex flex-row rounded-lg flex-1 gap-x-4 w-1/3 p-4 mt-4 bg-blue-100">
	<div class=" p-4 card">
		{#if !!mode}
			<Cashfree bind:this={cashfreeRoot} {mode}></Cashfree>
			<button
				on:click={async (e) => {
					e.preventDefault();
					await doCheckout(e);
				}}
				class="mt-0 w-full text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
			>
				Pay Now
			</button>
		{/if}
	</div>
</div>

<style>
	:global(.input-text) {
		@apply w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:shadow-md outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100;
	}
</style>
