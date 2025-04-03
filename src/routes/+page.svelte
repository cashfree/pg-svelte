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
</script>

<Cashfree.Root {env} {styleObject}>
	<div class="" slot="CardNumber">
		<label>Card Number</label>
		<Cashfree.CardNumber class="raj" style="width: 220px;">asa</Cashfree.CardNumber>
	</div>
</Cashfree.Root>
