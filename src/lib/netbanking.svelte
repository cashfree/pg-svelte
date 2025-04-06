<script>
	import { onMount, setContext } from 'svelte';
	import BaseComponent from './base-component.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let component;
	export let netbankingBankName = '';
	export let buttonText = '';
	export let buttonIcon = true;
	export let size = '2rem';

	let styles = {
		base: {
			fontSize: size
		}
	};

	// Extract props we want to modify
	let { values = {}, ...otherProps } = $$restProps;

	// Modify the values object
	if (!values.netbankingBankName) {
		values.netbankingBankName = netbankingBankName;
	}
	if (!values.buttonText) {
		values.buttonText = buttonText;
	}

	if (!values.buttonIcon && !!buttonIcon && (buttonIcon === true || buttonIcon === 'true')) {
		values.buttonIcon = true;
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
	{styles}
	bind:component
	type="netbanking"
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
