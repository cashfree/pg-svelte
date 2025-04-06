<script>
	import { onMount } from 'svelte';
	import * as Cashfree from '$lib';
	import NetbankingList from '$lib/netbanking-list';
	import { paymentSessionIdStore } from '../store';
	import code from './+page.svelte?raw';
	import { getMode } from '../utils';

	let mode;

	onMount(() => {
		mode = getMode();
	});

	let isReadyForPayment = false;

	let errorMsg = '';

	async function doPayment(e) {
		errorMsg = '';
		paymentOptions.paymentSessionId = $paymentSessionIdStore;
		try {
			let res = await selectedUPIApp.component.pay(paymentOptions);
			if (!!res.error) {
				throw new Error(res.error.message);
			}
		} catch (error) {
			errorMsg = error.message;
			console.error('Payment failed:', error);
		}
	}

	let styles = {
		base: {
			fontSize: '2rem'
		}
	};

	let paymentOptions = {
		redirectTarget: '_self',
		redirect: 'if_required',
		offerId: ''
	};

	let netbankingBanks = NetbankingList.map((item) => {
		return {
			netbankingBankName: item.netbankingBankName,
			netbankingBankDisplay: item.netbankingBankDisplay,
			component: null,
			selected: false
		};
	});

	let selectedUPIApp = null;
	function selectUPIAPP(app) {
		for (let i = 0; i < netbankingBanks.length; i++) {
			let appx = netbankingBanks[i];
			if (appx.netbankingBankName === app.netbankingBankName) {
				netbankingBanks[i].selected = true;
			} else {
				netbankingBanks[i].selected = false;
			}
		}
		selectedUPIApp = app;
	}
</script>

<div class="flex flex-col gap-y-2 justify-left rounded-lg">
	<h1 class="text-lg font-bold text-blue-800">Demo of Netbanking</h1>
</div>

<div class="flex flex-row rounded-lg flex-1 gap-x-4 p-4 mt-4 bg-blue-100">
	{#if !!mode}
		<div class="w-full flex flex-col gap-y-4 p-2">
			<div class="flex flex-col gap-2 flex-wrap overflow-auto justify-center max-h-96">
				{#each netbankingBanks as app}
					<div
						class="{app.selected
							? 'border-2 border-blue-500'
							: ''}  bg-white w-96 cursor-pointer h-14 p-2 flex flex-col justify-center rounded-md shadow-lg"
					>
						<Cashfree.Root
							bind:this={app.component}
							{mode}
							on:click={() => {
								selectUPIAPP(app);
							}}
							class="flex flex-row gap-x-2 pl-2  justify-start"
						>
							<Cashfree.Netbanking netbankingBankName={app.netbankingBankName} class="w-8 h-8" />
							<label class="text-sm cursor-pointer mt-1.5 font-medium text-center">
								{app.netbankingBankDisplay}
							</label>
						</Cashfree.Root>
					</div>
				{/each}
			</div>
			{#if !!errorMsg}
				<div class="text-red-500 text-xs text-center font-semibold">{errorMsg}</div>
			{/if}
			<div class="text-center flex justify-center">
				{#if selectedUPIApp}
					<button
						type="button"
						on:click={doPayment}
						class="  text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					>
						Continue with {selectedUPIApp.netbankingBankDisplay}
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
