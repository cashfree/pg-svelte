<script>
	import { onMount } from 'svelte';
	import * as Cashfree from '$lib';
	import { paymentSessionIdStore } from '../store';
	import { env } from '../store';
	import code from './+page.svelte?raw';

	let mode;

	//env subscribe
	let unsubscribe = env.subscribe((value) => {
		mode = value;
	});

	let isReadyForPayment = false;
	function checkState(e) {
		isReadyForPayment = e.detail.isComplete;
	}
	let cashfreeUPICollect;
	let errorMsg = '';

	async function doPayment(e) {
		paymentOptions.paymentSessionId = $paymentSessionIdStore;
		try {
			let res = await cashfreeUPICollect.pay(paymentOptions);
			if (!!res.error) {
				throw new Error(res.error.message);
			}
		} catch (error) {
			errorMsg = error.message;
			console.error('Payment failed:', error);
		}
	}

	let paymentOptions = {
		redirectTarget: '_self',
		redirect: 'if_required',
		offerId: ''
	};
</script>

<div class="flex flex-col gap-y-2 justify-left rounded-lg">
	<h1 class="text-lg font-bold text-blue-800">Demo of Cards {mode}</h1>
</div>

<div class="flex flex-row rounded-lg flex-1 gap-x-4 p-4 mt-4 bg-blue-100">
	<div class="w-4/5 p-4 card">
		<Cashfree.Root bind:this={cashfreeUPICollect} {mode} on:complete={checkState}>
			<div class="flex flex-col gap-y-4">
				<div class="flex flex-col gap-y-1">
					<label class="text-sm font-medium">UPI ID</label>
					<Cashfree.UPICollect class="input-text" placeholder="upi@somebank" />
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
	<div class="w-3/5 hidden">
		<pre
			style="box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;"
			class="bg-slate-800 text-white rounded-md p-2 overflow-x-auto overflow-y-auto shadow-lg h-screen">{code}</pre>
	</div>
</div>

<style>
	.input-text {
		@apply w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:shadow-md outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100;
	}
</style>
