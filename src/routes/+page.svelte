<script>
	import { onMount } from 'svelte';
	import * as Cashfree from '$lib';
	let env = 'production';
	let styleObject = {
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
		console.log('>>>>>>----  +page:32 ', cardComponent);
	}
</script>

<Cashfree.Root {env} {styleObject}>
	<div class="" slot="CardNumber">
		<label>Card Number</label>
		<Cashfree.CardNumber
			bind:component={cardComponent}
			class="raj"
			{values}
			style="width: 220px;"
		/>
	</div>
</Cashfree.Root>

<button
	on:click={() => {
		cardComponent.clear();
		console.log('>>>>>>----  +page:53 ', cardComponent.data());
	}}
>
	Click
</button>
