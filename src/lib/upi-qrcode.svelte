<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import BaseComponent from './base-component.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let component: any;
	export let size = '220px';

	// Extract props we want to modify
	let { values = {}, ...otherProps } = $$restProps;

	// Modify the values object
	if (!values.size) {
		values.size = size;
	}

	// Create a new props object with our modifications
	const modifiedProps = {
		...otherProps,
		values
	};
	onMount(() => {
		// component.on('complete', (event) => {
		// 	console.log('UPI QR Code complete event:', event);
		// });
	});
</script>

<BaseComponent
	bind:component
	type="upiQr"
	on:ready
	on:focus
	on:blur
	on:invalid
	on:change
	on:empty
	on:complete
	on:click
	on:paymentrequested
	on:loaderror
	{...modifiedProps}
/>
