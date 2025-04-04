<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import '../demo.css';
	import * as Cashfree from '$lib';
	let mode = 'sandbox';

	let isReadyForPayment = false;
	function checkState(e) {
		isReadyForPayment = e.detail.complete;
	}
	let cashfreeCard;
	let errorMsg = '';

	async function doPayment(e) {
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
		paymentSessionId: '',
		redirectTarget: '_self',
		redirect: 'if_required',
		offerId: ''
	};
</script>

<div class="flex flex-col gap-y-2 justify-left p-4 rounded-lg">
	<h1 class="text-lg font-bold text-blue-800">Welcome to Cashfree Components - Svelte</h1>
	<h2 class="text-sm font-medium text-gray-400">
		Build your payment experience with Cashfree Components
	</h2>
</div>

<div class="container mt-2 px-4">
	<h3 class="">Here are the list of components available in the Cashfree Components library:</h3>
	<ol class="space-y-4 mt-4 max-w-2xl text-gray-800 list-none list-inside dark:text-gray-800">
		<li>
			<p class="flex flex-row justify-between">
				<span class="text-lg font-medium text-blue-600 mt-2">Card Component</span>
				<a href="{base}/cards">
					<button
						type="button"
						class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
					>
						View Cards Demo
					</button>
				</a>
			</p>
			<ul class="ps-5 mt-2 space-y-1 list-none">
				<li><b>&#x3C;Cashfree.CardNumber /&#x3E;</b>: To collect card number from customer</li>
				<li><b>&#x3C;Cashfree.CardHolder /&#x3E;</b>: To collect card holder name from customer</li>
				<li><b>&#x3C;Cashfree.CardExpiry /&#x3E;</b>: To collect card expiry date from customer</li>
				<li><b>&#x3C;Cashfree.CardCVV /&#x3E;</b>: To collect card CVV from customer</li>
				<li>
					<b>&#x3C;Cashfree.SaveInstrument /&#x3E;</b>: To collect card save option from customer
				</li>
			</ul>
		</li>
	</ol>
</div>
