<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import * as CashfreeModule from '$lib';
	import { paymentSessionIdStore } from '../store.js';
	// Import with ?raw currently causing TypeScript errors, comment for now
	// import code from './+page.svelte?raw';

	import { getMode } from '../utils.js';

	let mode: 'sandbox' | 'production';

	onMount(() => {
		mode = getMode() as 'sandbox' | 'production';
	});

	let isReadyForPayment = false;
	function checkState(e: CustomEvent<any>) {
		isReadyForPayment = e.detail.isComplete;
	}
	let cashfreeUPICollect: any;
	let errorMsg = '';

	async function doPayment(e: Event) {
		paymentOptions.paymentSessionId = $paymentSessionIdStore;
		try {
			let res = await cashfreeUPICollect.pay(paymentOptions);
			if (!!res.error) {
				throw new Error(res.error.message);
			}
		} catch (error: any) {
			errorMsg = error.message;
			console.error('Payment failed:', error);
		}
	}

	let paymentOptions: Record<string, any> = {
		redirectTarget: '_self',
		redirect: 'if_required',
		offerId: ''
	};

	// Extract UPICollect component for use in the template
	const { UPICollect } = CashfreeModule;
</script>

<div class="flex flex-col gap-y-2 justify-left rounded-lg">
	<h1 class="text-lg font-bold text-blue-800">Demo of UPI Collect {mode}</h1>
</div>

<div class="flex flex-row rounded-lg flex-1 gap-x-4 w-1/3 p-4 mt-4 bg-blue-100">
	<div class=" p-4 card">
		{#if !!mode}
			<CashfreeModule.Cashfree bind:this={cashfreeUPICollect} {mode} on:complete={checkState}>
				<div class="flex flex-col gap-y-4">
					<div class="flex flex-col gap-y-1">
						<label for="upi-id" class="text-sm font-medium">UPI ID</label>
						<UPICollect id="upi-id" class="input-text" placeholder="upi@somebank" />
					</div>

					{#if !!errorMsg}
						<div class="text-red-500 text-xs font-semibold">{errorMsg}</div>
					{/if}
					<div class="flex justify-end">
						<button
							type="button"
							disabled={!isReadyForPayment}
							on:click={doPayment}
							class="mt-0 w-full text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
						>
							Pay Now
						</button>
					</div>
				</div>
			</CashfreeModule.Cashfree>
		{/if}
	</div>
</div>

<style>
	:global(.input-text) {
		@apply w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:shadow-md outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100;
	}
</style>
