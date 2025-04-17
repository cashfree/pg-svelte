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

	let cashfreeQr: any;
	let errorMsg = '';

	async function doPayment(e: Event) {
		errorMsg = '';
		paymentOptions.paymentSessionId = $paymentSessionIdStore;
		try {
			let res = await cashfreeQr.pay(paymentOptions);
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
	function complete(e: CustomEvent<any>) {
		isReadyForPayment = true;
	}
	function ready(e: CustomEvent<any>) {
		isReadyForPayment = true;
	}
	let hidePayNow = false;

	// Make components available in template
	const { UPIQRCode } = CashfreeModule;
</script>

<div class="flex flex-col gap-y-2 justify-left rounded-lg">
	<h1 class="text-lg font-bold text-blue-800">Demo of UPI Qr Code</h1>
</div>

<div class="flex flex-row rounded-lg flex-1 gap-x-4 w-[340px] p-4 mt-4 bg-blue-100">
	{#if !!mode}
		<div class=" p-4">
			<CashfreeModule.Cashfree
				bind:this={cashfreeQr}
				{mode}
				on:complete={complete}
				on:paymentrequested={(e: CustomEvent<any>) => {
					hidePayNow = true;
				}}
				on:ready={ready}
				class="w-full"
			>
				<div class="flex flex-col gap-y-4" let:stateful>
					<div class="flex flex-col gap-y-1">
						<label id="qr-label" class="text-sm font-medium text-center">Scan the QR Code</label>
						<UPIQRCode size="275px" class="mx-auto" aria-labelledby="qr-label" />
					</div>

					{#if !!errorMsg}
						<div class="text-red-500 text-xs font-semibold">{errorMsg}</div>
					{/if}
					<div class="flex justify-end">
						<button
							class:hidden={!hidePayNow}
							type="button"
							disabled={!isReadyForPayment}
							on:click={doPayment}
							class="mt-0 w-full text-white bg-green-700 hover:bg-green-800 disabled:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
						>
							Regenerate QR
						</button>
						<button
							class:hidden={hidePayNow}
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
		</div>
	{/if}
</div>
