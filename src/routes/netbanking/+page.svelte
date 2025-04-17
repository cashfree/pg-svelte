<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import * as CashfreeModule from '$lib';
	// @ts-ignore
	import NetbankingList from '$lib/netbanking-list';
	import { paymentSessionIdStore } from '../store.js';
	// Import with ?raw currently causing TypeScript errors, comment for now
	// import code from './+page.svelte?raw';
	import { getMode } from '../utils.js';

	let mode: 'sandbox' | 'production';

	onMount(() => {
		mode = getMode() as 'sandbox' | 'production';
	});

	let isReadyForPayment = false;

	let errorMsg = '';

	async function doPayment(e: Event) {
		errorMsg = '';
		paymentOptions.paymentSessionId = $paymentSessionIdStore;
		try {
			if (!!selectedUPIApp && selectedUPIApp.component) {
				let res = await selectedUPIApp.component.pay(paymentOptions);
				if (!!res.error) {
					throw new Error(res.error.message);
				}
			} else {
				throw new Error('Please select a payment method');
			}
		} catch (error: any) {
			errorMsg = error.message;
			console.error('Payment failed:', error);
		}
	}

	let styles = {
		base: {
			fontSize: '2rem'
		}
	};

	let paymentOptions: Record<string, any> = {
		redirectTarget: '_self',
		redirect: 'if_required',
		offerId: ''
	};

	interface NetbankingBank {
		netbankingBankName: string;
		netbankingBankDisplay: string;
		component: any;
		selected: boolean;
	}

	let netbankingBanks: NetbankingBank[] = NetbankingList.map((item: any) => {
		return {
			netbankingBankName: item.netbankingBankName,
			netbankingBankDisplay: item.netbankingBankDisplay,
			component: null,
			selected: false
		};
	});

	let selectedUPIApp: NetbankingBank | null = null;
	function selectUPIAPP(app: NetbankingBank) {
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
						<CashfreeModule.Cashfree
							bind:this={app.component}
							{mode}
							on:click={() => {
								selectUPIAPP(app);
							}}
							class="flex flex-row gap-x-2 pl-2  justify-start"
						>
							<CashfreeModule.Netbanking
								netbankingBankName={app.netbankingBankName}
								class="w-8 h-8"
							/>
							<span
								id="bank-{app.netbankingBankName}"
								class="text-sm cursor-pointer mt-1.5 font-medium text-center"
							>
								{app.netbankingBankDisplay}
							</span>
						</CashfreeModule.Cashfree>
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
