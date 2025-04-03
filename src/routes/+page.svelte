<script>
	import { onMount } from 'svelte';
	import * as Cashfree from '$lib';
	let env = 'production';
	let styles = {
		fonts: [],
		base: {
			fontSize: '16px',
			// fontFamily: 'Lato',
			backgroundColor: '#FFFFFF',
			':focus': {
				border: '1px solid #2361d5'
			},
			border: '1px solid #e6e6e6',
			borderRadius: '5px',
			padding: '16px',
			color: '#000000'
		},
		invalid: {
			color: '#df1b41'
		}
	};

	function iAmReady() {
		console.log('I am r2eady');
	}
	let values = {
		placeholder: '4xxx xxxx xxxx 4321'
	};
	let cardComponent;

	$: {
	}
</script>

<Cashfree.Root {env} {styles}>
	<div class="" style="width: 300px;">
		<label>Card Number</label>
		<Cashfree.CardNumber bind:component={cardComponent} class="raj" on:change={iAmReady} {values} />
	</div>
	<div class="" style="width: 100px;margin-top: 10px;">
		<label>Card Expiry</label>
		<Cashfree.CardExpiry />
	</div>
	<div class="" style="width: 100px;margin-top: 10px;">
		<label>Card CVV</label>
		<Cashfree.CardCVV />
	</div>
	<div class="" style="width: 300px;margin-top: 10px;">
		<label> Card Holder Name</label>
		<Cashfree.CardHolder />
	</div>
	<button
		disabled
		style="width: 300px;margin-top: 10px;"
		on:click={() => {
			cardComponent.clear();
			console.log('>>>>>>----  +page:53 ', cardComponent.data());
		}}
	>
		Click
	</button>
</Cashfree.Root>
