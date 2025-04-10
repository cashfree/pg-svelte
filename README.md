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

The first step is to import the Cashfree components and set up a `Root` component that will host your payment method.

```svelte
<script>
	import * as Cashfree from '$lib';
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

<Cashfree.Root bind:this={cashfreeComponent} {mode}>
	<!-- Payment components go here -->
</Cashfree.Root>
```

## Payment Methods

### Card Payment

Card payment requires four components: CardNumber, CardHolder, CardExpiry, and CardCVV. Optionally, you can include SaveInstrument to let users save their card.

```svelte
<Cashfree.Root bind:this={cashfreeCard} {mode} on:complete={checkState}>
	<div class="form-container">
		<div>
			<label>Card Number</label>
			<Cashfree.CardNumber class="input-text" placeholder="4111 XXXX XXXX 1111" />
		</div>
		<div>
			<label>Card Holder Name</label>
			<Cashfree.CardHolder class="input-text" />
		</div>
		<div class="expiry-cvv-container">
			<div>
				<label>Expiry</label>
				<Cashfree.CardExpiry class="input-text" />
			</div>
			<div>
				<label>CVV</label>
				<Cashfree.CardCVV class="input-text" />
			</div>
		</div>
		<div>
			<Cashfree.SaveInstrument label="Save this card for future payments" />
		</div>
		<button on:click={doPayment} disabled={!isReadyForPayment}>Pay Now</button>
	</div>
</Cashfree.Root>
```

### UPI QR Code

Display a QR code that customers can scan with any UPI-enabled app.

```svelte
<Cashfree.Root
	bind:this={cashfreeQr}
	{mode}
	on:complete={complete}
	on:paymentrequested={handlePaymentRequested}
	on:ready={ready}
>
	<div>
		<label>Scan the QR Code</label>
		<Cashfree.UPIQRCode size="275px" class="qr-code" />
		<button on:click={doPayment} disabled={!isReadyForPayment}>Pay Now</button>
	</div>
</Cashfree.Root>
```

### UPI App Intent

Show UPI app icons for mobile users to select their preferred UPI app.

```svelte
<div class="upi-apps-container">
	{#each upiApps as app}
		<div class={app.selected ? 'selected-app' : 'app'}>
			<Cashfree.Root bind:this={app.component} {mode} on:click={() => selectUPIApp(app)}>
				<Cashfree.UPIAPP upiApp={app.type} class="app-icon" />
				<label>{app.name}</label>
			</Cashfree.Root>
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
<Cashfree.Root bind:this={cashfreeUPICollect} {mode} on:complete={checkState}>
	<div>
		<label>UPI ID</label>
		<Cashfree.UPICollect class="input-text" placeholder="yourname@upi" />
		<button on:click={doPayment} disabled={!isReadyForPayment}>Pay Now</button>
	</div>
</Cashfree.Root>
```

### Netbanking

Display a list of banks for netbanking payment.

```svelte
<div class="netbanking-container">
	{#each netbankingBanks as bank}
		<div class={bank.selected ? 'selected-bank' : 'bank'}>
			<Cashfree.Root bind:this={bank.component} {mode} on:click={() => selectBank(bank)}>
				<Cashfree.Netbanking netbankingBankName={bank.netbankingBankName} class="bank-icon" />
				<label>{bank.netbankingBankDisplay}</label>
			</Cashfree.Root>
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
<div>
	<label for="phone">Enter Phone number</label>
	<input type="text" bind:value={phone} class="input-text" id="phone" />
</div>

<div class="wallets-container">
	{#each walletProviders as wallet}
		<div class={wallet.selected ? 'selected-wallet' : 'wallet'}>
			<Cashfree.Root bind:this={wallet.component} {mode} on:click={() => selectWallet(wallet)}>
				<Cashfree.Wallet provider={wallet.provider} {phone} class="wallet-icon" />
				<label>{wallet.buttonText}</label>
			</Cashfree.Root>
		</div>
	{/each}
</div>

{#if selectedWallet}
	<button on:click={doPayment}>Continue with {selectedWallet.buttonText}</button>
{/if}
```

## Event Handling

Cashfree components emit various events you can listen to:

```svelte
<script>
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
</script>

<Cashfree.Root
	bind:this={component}
	{mode}
	on:ready={handleReady}
	on:complete={handleComplete}
	on:change={handleChange}
	on:paymentrequested={handlePaymentRequested}
	on:loaderror={handleLoadError}
>
	<!-- Components -->
</Cashfree.Root>
```

## Styling Components

You can style components using Tailwind classes or custom CSS:

```svelte
<script>
	const customStyles = {
		base: {
			fontSize: '16px',
			color: '#333',
			'::placeholder': {
				color: '#999'
			}
		},
		focus: {
			border: '1px solid #4f46e5'
		}
	};
</script>

<!-- Using Tailwind classes -->
<Cashfree.CardNumber class="w-full rounded-md border border-gray-300 px-3 py-2" />

<!-- Using custom styles -->
<Cashfree.Root {mode} styles={customStyles}>
	<Cashfree.CardNumber class="custom-input" />
</Cashfree.Root>

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
