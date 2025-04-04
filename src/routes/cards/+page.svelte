<script>
	import { onMount } from 'svelte';
	import * as Cashfree from '$lib';
	import { paymentSessionIdStore } from '../store';
	import code from './+page.svelte?raw';

	let mode = 'sandbox';

	let isReadyForPayment = false;
	function checkState(e) {
		isReadyForPayment = e.detail.complete;
	}
	let cashfreeCard;
	let errorMsg = '';

	async function doPayment(e) {
		paymentOptions.paymentSessionId = $paymentSessionIdStore;
		try {
			let res = await cashfreeCard.pay(paymentOptions);
			if (!!res.error) {
				throw new Error(res.error.message);
			}
		} catch (error) {
			errorMsg = error.message;
			console.error('Payment failed:', error);
		}
	}

	let saveText = {
		label: 'Save this card for future payments'
	};
	let paymentOptions = {
		redirectTarget: '_self',
		redirect: 'if_required',
		offerId: ''
	};
</script>

<div class="flex items-center justify-center bg-blue-100 p-4 rounded-lg">
	<h1 class="text-xs font-bold text-blue-800">Cashfree Card Component - Svelte</h1>
</div>

<div class="flex flex-row flex-1 gap-x-4 pt-10">
	<div class="w-2/5 p-4 shadow-md rounded-md bg-white">
		<Cashfree.Root bind:this={cashfreeCard} {mode} on:state={checkState}>
			<div class="flex flex-col gap-y-4">
				<div class="flex flex-col gap-y-1">
					<label class="text-sm font-medium">Card Number</label>
					<Cashfree.CardNumber class="input-text" />
				</div>
				<div class="flex flex-col gap-y-1">
					<label class="text-sm font-medium">Card Holder Name</label>
					<Cashfree.CardHolder class="input-text" />
				</div>
				<div class="grid grid-cols-4 gap-x-2 justify-between">
					<div class="col-span-2 flex flex-row gap-x-2">
						<div class="flex flex-col gap-y-1">
							<label class="text-sm font-medium">Expiry</label>
							<Cashfree.CardExpiry class="input-text" />
						</div>
						<div class="flex flex-col gap-y-1">
							<label class="text-sm font-medium">CVV</label>
							<Cashfree.CardCVV class="input-text" />
						</div>
					</div>
				</div>
				<div class="flex justify-start">
					<Cashfree.SaveInstrument values={saveText} />
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
		</Cashfree.Root>
	</div>
	<div class="w-3/5">
		<pre
			class="bg-slate-800 text-white rounded-md p-2 overflow-x-auto overflow-y-auto shadow-md h-screen">{code}</pre>
	</div>
</div>
