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

	interface UPIApp {
		type: string;
		name: string;
		component: any;
		selected: boolean;
	}

	let upiApps: UPIApp[] = [
		{
			type: 'gpay',
			name: 'Google Pay',
			component: null,
			selected: false
		},
		{
			type: 'phonepe',
			name: 'PhonePe',
			component: null,
			selected: false
		},
		{
			type: 'paytm',
			name: 'Paytm',
			component: null,
			selected: false
		},
		{
			type: 'bhim',
			name: 'Bhim',
			component: null,
			selected: false
		}
	];

	let selectedUPIApp: UPIApp | null = null;
	function selectUPIAPP(app: UPIApp) {
		for (let i = 0; i < upiApps.length; i++) {
			let appx = upiApps[i];
			if (appx.type === app.type) {
				upiApps[i].selected = true;
			} else {
				upiApps[i].selected = false;
			}
		}
		selectedUPIApp = app;
	}
</script>

<div class="flex flex-col gap-y-2 justify-left rounded-lg">
	<h1 class="text-lg font-bold text-blue-800">Demo of UPI Intent - Mobile Only</h1>
</div>

<div class="flex flex-row rounded-lg flex-1 gap-x-4 p-4 mt-4 bg-blue-100">
	{#if !!mode}
		<div class="w-full flex flex-col gap-y-4 p-2">
			<div class="flex flex-row gap-2 flex-wrap justify-center">
				{#each upiApps as app}
					<div
						class="{app.selected
							? 'border-2 border-blue-500'
							: ''} flex flex-col gap-y-2 bg-white w-24 h-24 p-2 text-center justify-center rounded-md shadow-lg"
					>
						<CashfreeModule.Cashfree
							bind:this={app.component}
							{mode}
							on:click={() => {
								selectUPIAPP(app);
							}}
						>
							<CashfreeModule.UPIAPP upiApp={app.type} class="mx-auto w-8 h-8" />
							<label id="{app.type}-label" class="text-sm font-medium text-center">
								{app.name}
							</label>
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
						class=" w-56 text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					>
						Continue with {selectedUPIApp.name}
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
