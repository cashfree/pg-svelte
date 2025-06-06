<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import { Cashfree, CardNumber, CardHolder, CardExpiry, CardCVV, SaveInstrument } from '$lib';
	import { paymentSessionIdStore } from '../store.js';

	import { getMode } from '../utils.js';

	let mode: 'sandbox' | 'production';

	onMount(() => {
		mode = getMode() as 'sandbox' | 'production';
	});

	let isReadyForPayment = false;
	function checkState(e: CustomEvent<any>) {
		isReadyForPayment = e.detail.isComplete;
	}
	let cashfreeCard: any;
	let errorMsg = '';

	async function doPayment(e: Event) {
		paymentOptions.paymentSessionId = $paymentSessionIdStore;
		try {
			if (cashfreeCard) {
				let res = await cashfreeCard.pay(paymentOptions);
				if (!!res.error) {
					throw new Error(res.error.message);
				}
			} else {
				throw new Error('Payment component not initialized');
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

	// Make components available in template
</script>

<div class="flex flex-col gap-y-2 justify-left rounded-lg">
	<h1 class="text-lg font-bold text-blue-800">Demo of Cards ({mode})</h1>
</div>

<div class="flex flex-row rounded-lg flex-1 gap-x-4 p-4 mt-4 w-1/3 bg-blue-100">
	<div class=" card">
		{#if !!mode}
			<Cashfree bind:this={cashfreeCard} {mode} on:complete={checkState}>
				<div class="flex flex-col gap-y-4">
					<div class="flex flex-col gap-y-1">
						<label for="card-number" class="text-sm font-medium">Card Number</label>
						<CardNumber id="card-number" class="input-text" placeholder="4111 XXXX XXXX 1111" />
					</div>
					<div class="flex flex-col gap-y-1">
						<label for="card-holder" class="text-sm font-medium">Card Holder Name</label>
						<CardHolder id="card-holder" class="input-text" />
					</div>
					<div class="grid grid-cols-4 gap-x-2 justify-between">
						<div class="col-span-2 flex flex-row gap-x-2">
							<div class="flex flex-col gap-y-1">
								<label for="card-expiry" class="text-sm font-medium">Expiry</label>
								<CardExpiry id="card-expiry" class="input-text" />
							</div>
							<div class="flex flex-col gap-y-1">
								<label for="card-cvv" class="text-sm font-medium">CVV</label>
								<CardCVV id="card-cvv" class="input-text" />
							</div>
						</div>
					</div>
					<div class="flex justify-start">
						<SaveInstrument label="Save this card for the future" />
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
			</Cashfree>
		{/if}
	</div>
</div>

<style>
	:global(.input-text) {
		@apply w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:shadow-md outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100;
	}
</style>
