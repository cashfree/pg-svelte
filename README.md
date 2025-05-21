# Cashfree Payments for Svelte
![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg) ![Build](https://img.shields.io/badge/build-stable-blue) ![GitHub Release](https://img.shields.io/github/v/release/cashfree/pg-svelte?color=green) ![NPM Downloads](https://img.shields.io/npm/dm/pg-svelte?label=NPM%20Downloads&color=green)

A Svelte component library for integrating Cashfree Payment Gateway in your Svelte applications.

## Quick Start Guide

1. **Install the package**

   ```bash
   npm install @cashfreepayments/pg-svelte
   ```

2. **Import and set up the Cashfree component**

```svelte
<script>
	import { Cashfree, CardNumber } from '@cashfreepayments/pg-svelte';

	let cashfreeComponent;
	let mode = 'sandbox';
	let paymentSessionId = 'your-payment-session-id'; // Get this from your backend
	let isReadyForPayment = false;

	function checkState(e) {
		isReadyForPayment = e.detail.isComplete;
	}

	async function handlePayment() {
		const result = await cashfreeComponent.pay({
			paymentSessionId
		});

		if (result.error) {
			//there is an error
			//message at result.error.message
		}
		if (result.redirect) {
			//console.log("User would be redirected");
		}
		if (result.paymentDetails) {
			//only when redirect = 'if_required' for UPI payment
			//payment is successful
			//message is at result.paymentDetails.paymentMessage
		}
	}
</script>

<Cashfree bind:this={cashfreeComponent} {mode} on:complete={checkState}>
	<!-- Add payment component here -->
	<CardNumber class="input" placeholder="Card number" />
	<CardHolder id="card-holder" class="input" />
	<CardExpiry id="card-expiry" class="input" />
	<CardCVV id="card-cvv" class="input" />
	<button disabled={!isReadyForPayment} on:click={handlePayment}>Pay Now</button>
</Cashfree>
```

There are lot of other configurations that you can use. You can read them [here](https://www.cashfree.com/docs/payments/online/element/payment-options)

3. **Run your app** and test the integration!

## Table of Contents

1. Installation
2. Basic Setup
3. Payment Methods
   - Card Payment
   - UPI QR Code
   - UPI App Intent
   - UPI Collect
   - Netbanking
   - Wallets
4. Event Handling
5. Styling Components

## Installation

Install the package using npm:

```bash
npm install @cashfreepayments/pg-svelte
```

## Basic Setup

The first step is to import the Cashfree components and set up a `Cashfree` component that will host your payment method.

```svelte
<script>
	import { Cashfree } from '@cashfreepayments/pg-svelte';
	import { onMount } from 'svelte';

	let mode = 'sandbox'; // or 'production' for live payments
	let cashfreeComponent;
	let paymentSessionId = 'your-payment-session-id';

	let paymentOptions = {
		paymentSessionId: paymentSessionId,
		redirectTarget: '_self',
		redirect: 'if_required'
	};

	async function doPayment() {
		try {
			const result = await cashfreeComponent.pay(paymentOptions);
			if (result.error) {
				throw new Error(result.error.message);
			}
			// Handle success
		} catch (error) {
			// Handle error
			console.error('Payment failed:', error);
		}
	}
</script>

<Cashfree bind:this={cashfreeComponent} {mode}>
	<!-- Payment components go here -->
</Cashfree>
```

## Payment Methods

### Card Payment

Card payment requires four components: CardNumber, CardHolder, CardExpiry, and CardCVV. Optionally, you can include SaveInstrument to let users save their card.

```svelte
<script>
	import {
		Cashfree,
		CardNumber,
		CardHolder,
		CardExpiry,
		CardCVV,
		SaveInstrument
	} from '@cashfreepayments/pg-svelte';

	// Track payment component state
	let isReadyForPayment = false;

	function checkState(e) {
		// Check if all required fields are complete
		isReadyForPayment = e.detail.isComplete;
	}
</script>

<Cashfree bind:this={cashfreeCard} {mode} on:complete={checkState}>
	<div class="form-container">
		<div>
			<label>Card Number</label>
			<CardNumber class="input-text" placeholder="4111 XXXX XXXX 1111" />
		</div>
		<div>
			<label>Card Holder Name</label>
			<CardHolder class="input-text" />
		</div>
		<div class="expiry-cvv-container">
			<div>
				<label>Expiry</label>
				<CardExpiry class="input-text" />
			</div>
			<div>
				<label>CVV</label>
				<CardCVV class="input-text" />
			</div>
		</div>
		<div>
			<SaveInstrument label="Save this card for future payments" />
		</div>
		<button on:click={doPayment} disabled={!isReadyForPayment}>Pay Now</button>
	</div>
</Cashfree>
```

### UPI QR Code

Display a QR code that customers can scan with any UPI-enabled app.

```svelte
<script>
	import { Cashfree, UPIQRCode } from '@cashfreepayments/pg-svelte';

	let isReadyForPayment = false;

	function ready(e) {
		console.log('Component ready');
	}

	function complete(e) {
		isReadyForPayment = e.detail.isComplete;
	}

	function handlePaymentRequested(e) {
		console.log('Payment requested', e.detail);
	}
</script>

<Cashfree
	bind:this={cashfreeQr}
	{mode}
	on:complete={complete}
	on:paymentrequested={handlePaymentRequested}
	on:ready={ready}
>
	<div>
		<label>Scan the QR Code</label>
		<UPIQRCode size="275px" class="qr-code" />
		<button on:click={doPayment} disabled={!isReadyForPayment}>Pay Now</button>
	</div>
</Cashfree>
```

### UPI App Intent

Show UPI app icons for mobile users to select their preferred UPI app.

```svelte
<script>
	import { Cashfree, UPIAPP } from '@cashfreepayments/pg-svelte';

	// Define available UPI apps
	let upiApps = [
		{ type: 'gpay', name: 'Google Pay', component: null, selected: false },
		{ type: 'phonepe', name: 'PhonePe', component: null, selected: false },
		{ type: 'paytm', name: 'Paytm', component: null, selected: false }
	];

	let selectedUPIApp = null;

	function selectUPIApp(app) {
		// Clear previous selections
		upiApps.forEach((a) => {
			a.selected = false;
		});

		// Set new selection
		app.selected = true;
		selectedUPIApp = app;
		upiApps = [...upiApps]; // Trigger reactivity
	}
</script>

<div class="upi-apps-container">
	{#each upiApps as app}
		<div class={app.selected ? 'selected-app' : 'app'}>
			<Cashfree bind:this={app.component} {mode} on:click={() => selectUPIApp(app)}>
				<UPIAPP upiApp={app.type} class="app-icon" />
				<label>{app.name}</label>
			</Cashfree>
		</div>
	{/each}
</div>

{#if selectedUPIApp}
	<button on:click={doPayment}>Continue with {selectedUPIApp.name}</button>
{/if}
```

### UPI Collect

Allow customers to enter their UPI ID for direct payment collection.

```svelte
<script>
	import { Cashfree, UPICollect } from '@cashfreepayments/pg-svelte';

	let isReadyForPayment = false;

	function checkState(e) {
		isReadyForPayment = e.detail.isComplete;
	}
</script>

<Cashfree bind:this={cashfreeUPICollect} {mode} on:complete={checkState}>
	<div>
		<label>UPI ID</label>
		<UPICollect class="input-text" placeholder="yourname@upi" />
		<button on:click={doPayment} disabled={!isReadyForPayment}>Pay Now</button>
	</div>
</Cashfree>
```

### Netbanking

Display a list of banks for netbanking payment.

```svelte
<script>
	import { Cashfree, Netbanking } from '@cashfreepayments/pg-svelte';
	import netbankingBanksList from '@cashfreepayments/pg-svelte/netbanking-list';

	// Import bank list or define your own
	let netbankingBanks = netbankingBanksList.map((bank) => ({
		...bank,
		component: null,
		selected: false
	}));

	let selectedBank = null;

	function selectBank(bank) {
		// Clear previous selection
		netbankingBanks.forEach((b) => {
			b.selected = false;
		});

		// Set new selection
		bank.selected = true;
		selectedBank = bank;
		netbankingBanks = [...netbankingBanks]; // Trigger reactivity
	}
</script>

<div class="netbanking-container">
	{#each netbankingBanks as bank}
		<div class={bank.selected ? 'selected-bank' : 'bank'}>
			<Cashfree bind:this={bank.component} {mode} on:click={() => selectBank(bank)}>
				<Netbanking netbankingBankName={bank.netbankingBankName} class="bank-icon" />
				<label>{bank.netbankingBankDisplay}</label>
			</Cashfree>
		</div>
	{/each}
</div>

{#if selectedBank}
	<button on:click={doPayment}>Continue with {selectedBank.netbankingBankDisplay}</button>
{/if}
```

### Wallets

Implement wallet payment options with phone number input.

```svelte
<script>
	import { Cashfree, Wallet } from '@cashfreepayments/pg-svelte';

	// Define available wallet providers
	let walletProviders = [
		{ provider: 'amazonpay', buttonText: 'Amazon Pay', component: null, selected: false },
		{ provider: 'phonepe', buttonText: 'PhonePe', component: null, selected: false },
		{ provider: 'paytm', buttonText: 'Paytm', component: null, selected: false }
	];

	let phone = '';
	let selectedWallet = null;

	function selectWallet(wallet) {
		if (!phone) {
			alert('Please enter phone number first');
			return;
		}

		// Clear previous selection
		walletProviders.forEach((w) => {
			w.selected = false;
		});

		// Set new selection
		wallet.selected = true;
		selectedWallet = wallet;
		walletProviders = [...walletProviders]; // Trigger reactivity
	}
</script>

<div>
	<label for="phone">Enter Phone number</label>
	<input type="text" bind:value={phone} class="input-text" id="phone" />
</div>

<div class="wallets-container">
	{#each walletProviders as wallet}
		<div class={wallet.selected ? 'selected-wallet' : 'wallet'}>
			<Cashfree bind:this={wallet.component} {mode} on:click={() => selectWallet(wallet)}>
				<Wallet provider={wallet.provider} {phone} class="wallet-icon" />
				<label>{wallet.buttonText}</label>
			</Cashfree>
		</div>
	{/each}
</div>

{#if selectedWallet}
	<button on:click={doPayment}>Continue with {selectedWallet.buttonText}</button>
{/if}
```

### Hosted Checkout Page

```svelte
<script>
	import { Cashfree } from '@cashfreepayments/pg-svelte';
	let checkoutOptions: Record<string, any> = {
		redirectTarget: '_modal'
	};
	let cashfreeRoot: any;
	let mode: 'sandbox' | 'production';
	mode = 'sandbox';
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
</script>

<Cashfree bind:this={cashfreeRoot} {mode}></Cashfree>
```

## Event Handling

Cashfree components emit various events you can listen to:

```svelte
<script>
	import { Cashfree } from '@cashfreepayments/pg-svelte';

	let isReadyForPayment = false;

	function handleComplete(e) {
		// e.detail contains information about the state
		// For example, e.detail.isComplete indicates if all required fields are filled
		isReadyForPayment = e.detail.isComplete;
	}

	function handlePaymentRequested(e) {
		// This event fires when payment is requested
		console.log('Payment requested');
	}

	function handleReady(e) {
		// Component is ready to accept input
		console.log('Component ready');
	}

	function handleChange(e) {
		// Field value has changed
		console.log('Value changed', e.detail);
	}

	function handleLoadError(e) {
		// Handle any loading errors
		console.error('Load error', e.detail);
	}
</script>

<Cashfree
	bind:this={component}
	{mode}
	on:ready={handleReady}
	on:complete={handleComplete}
	on:change={handleChange}
	on:paymentrequested={handlePaymentRequested}
	on:loaderror={handleLoadError}
>
	<!-- Components -->
</Cashfree>
```

## Styling Components

You can style components using Tailwind classes or custom CSS:

```svelte
<script>
	import { Cashfree, CardNumber } from '@cashfreepayments/pg-svelte';

	const customStyles = {
		classes: {
			base: 'my-input',
			focus: 'input-focused',
			invalid: 'input-error',
			complete: 'input-complete'
		},
		fonts: [
			{
				family: 'Roboto',
				src: 'https://fonts.googleapis.com/css2?family=Roboto'
			}
		],
		style: {
			base: {
				color: '#333',
				fontSize: '16px',
				fontFamily: 'Roboto, sans-serif',
				padding: '12px',
				backgroundColor: '#fff',
				border: '1px solid #ccc',
				borderRadius: '4px'
			},
			focus: {
				borderColor: '#0066cc'
			},
			invalid: {
				borderColor: '#ff3333',
				color: '#ff3333'
			}
		},
		disabled: false,
		loader: true
	};
</script>

<!-- Using Tailwind classes -->
<CardNumber class="w-full rounded-md border border-gray-300 px-3 py-2" />

<!-- Using custom styles -->
<Cashfree {mode} styles={customStyles}>
	<CardNumber class="custom-input" />
</Cashfree>

<style>
	.custom-input {
		width: 100%;
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid #ccc;
	}

	.custom-input:focus-within {
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
	}
</style>
```
